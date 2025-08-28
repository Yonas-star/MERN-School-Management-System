const express = require('express');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const { ObjectId } = mongoose.Types;

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/school', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  try {
    await insertStudents();
    mongoose.disconnect();
  } catch (error) {
    console.error('Error during student insertion:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Class Schema
const classSchema = new mongoose.Schema({
  sclassName: String,
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
}, { timestamps: true });

const SClass = mongoose.model('SClass', classSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  rollNum: Number,
  password: String,
  sclassName: { type: mongoose.Schema.Types.ObjectId, ref: 'SClass' },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  role: { type: String, default: 'Student' },
  attendance: { type: Array, default: [] },
  examResult: { type: Array, default: [] }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

async function insertStudents() {
  try {
    // Read Excel file
    const workbook = xlsx.readFile('for student 11-12.xlsx');
    const worksheet = workbook.Sheets['Sheet1'];
    
    // Get the range of data
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    
    // Extract data manually to ensure proper column mapping
    const data = [];
    for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
      const row = {};
      row.No = worksheet[xlsx.utils.encode_cell({r: rowNum, c: 0})]?.v;
      row.first_name = worksheet[xlsx.utils.encode_cell({r: rowNum, c: 1})]?.v;
      row.middle_name = worksheet[xlsx.utils.encode_cell({r: rowNum, c: 2})]?.v;
      row.last_name = worksheet[xlsx.utils.encode_cell({r: rowNum, c: 3})]?.v;
      row['Student Class'] = worksheet[xlsx.utils.encode_cell({r: rowNum, c: 6})]?.v;
      data.push(row);
    }

    // Verify school exists
    const schoolId = new ObjectId("67edb44d8e182ee75fdce343");
    
    // Get class references
    const grade11Class = await SClass.findOne({ sclassName: "11" });
    const grade12Class = await SClass.findOne({ sclassName: "12" });
    
    if (!grade11Class || !grade12Class) {
      throw new Error('Required classes (11 and 12) not found in database');
    }

    const hashedPassword = await bcrypt.hash('defaultPassword', 10);
    let insertedCount = 0;
    let skippedCount = 0;
    let grade11Count = 0;
    let grade12Count = 0;
    
    // Process students in batches
    const batchSize = 50;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const operations = [];

      for (const student of batch) {
        // Skip if empty row or header
        if (!student.No || student.No === "No") continue;
        
        const fullName = `${student.first_name} ${student.middle_name ? student.middle_name + ' ' : ''}${student.last_name}`.trim();
        
        // Get and validate class
        const studentClass = student['Student Class'];
        if (!studentClass) {
          console.warn(`Student ${student.No} has no class assigned`);
          continue;
        }
        
        const isGrade11 = studentClass.trim().toUpperCase() === 'GRADE11';
        const classId = isGrade11 ? grade11Class._id : grade12Class._id;
        
        if (isGrade11) grade11Count++;
        else grade12Count++;

        operations.push({
          updateOne: {
            filter: { 
              rollNum: parseInt(student.No),
              school: schoolId,
              sclassName: classId
            },
            update: {
              $setOnInsert: {
                name: fullName,
                rollNum: parseInt(student.No),
                password: hashedPassword,
                sclassName: classId,
                school: schoolId,
                role: 'Student'
              }
            },
            upsert: true
          }
        });
      }

      const result = await Student.bulkWrite(operations);
      insertedCount += result.upsertedCount;
      skippedCount += result.matchedCount;
      console.log(`Processed batch ${Math.floor(i/batchSize) + 1}: Inserted ${result.upsertedCount}, Skipped ${result.matchedCount}`);
    }
    
    console.log(`\nInsertion complete:
    - Total students processed: ${data.length - 1} (excluding header)
    - New students inserted: ${insertedCount}
    - Existing students skipped: ${skippedCount}
    - Grade 11 students: ${grade11Count}
    - Grade 12 students: ${grade12Count}`);
    
  } catch (error) {
    console.error('Error inserting students:', error);
    throw error;
  }
}
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
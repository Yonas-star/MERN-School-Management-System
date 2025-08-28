import { Container, Grid, Paper, Typography, Box, Chip } from '@mui/material';
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import Trophy from "../../assets/trophy.png";
import Passed from "../../assets/passed.png";
import Failed from "../../assets/failed.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user);
    const adminID = currentUser._id;

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    // Calculate student performance metrics
    const calculatePerformanceMetrics = () => {
        if (!studentsList || studentsList.length === 0) {
            return {
                highestScorer: null,
                passedCount: 0,
                failedCount: 0,
                passPercentage: 0
            };
        }

        let highestScore = -1;
        let highestScorer = null;
        let passedCount = 0;
        let failedCount = 0;

        studentsList.forEach(student => {
            if (student.examResult && student.examResult.length > 0) {
                const totalMarks = student.examResult.reduce((sum, result) => sum + (result.marksObtained || 0), 0);
                const averageMarks = totalMarks / student.examResult.length;

                if (averageMarks > highestScore) {
                    highestScore = averageMarks;
                    highestScorer = {
                        name: student.name,
                        rollNum: student.rollNum,
                        score: averageMarks
                    };
                }

                if (averageMarks >= 40) {
                    passedCount++;
                } else {
                    failedCount++;
                }
            }
        });

        const passPercentage = numberOfStudents > 0 ? (passedCount / numberOfStudents) * 100 : 0;

        return {
            highestScorer,
            passedCount,
            failedCount,
            passPercentage
        };
    };

    const { highestScorer, passedCount, failedCount, passPercentage } = calculatePerformanceMetrics();

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledCard>
                            <img src={Students} alt="Students" />
                            <Title>Total Students</Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledCard>
                            <img src={Classes} alt="Classes" />
                            <Title>Total Classes</Title>
                            <Data start={0} end={numberOfClasses} duration={5} />
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledCard>
                            <img src={Teachers} alt="Teachers" />
                            <Title>Total Teachers</Title>
                            <Data start={0} end={numberOfTeachers} duration={2.5} />
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledCard>
                            <img src={Fees} alt="Fees" />
                            <Title>Fees Collection in Birr</Title>
                            <Data start={0} end={numberOfStudents * 3000} duration={2.5} prefix="Birr " />
                        </StyledCard>
                    </Grid>

                    {/* Performance Metrics Cards */}
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledCard>
                            <img src={Trophy} alt="Highest Scorer" style={{ width: 60, height: 60 }} />
                            <Title>Highest Scorer</Title>
                            {highestScorer ? (
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {highestScorer.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Roll No: {highestScorer.rollNum}
                                    </Typography>
                                    <Chip 
                                        label={`Score: ${highestScorer.score.toFixed(2)}`} 
                                        color="success" 
                                        sx={{ mt: 1, fontWeight: 'bold' }}
                                    />
                                </Box>
                            ) : (
                                <Typography variant="body1">No data available</Typography>
                            )}
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledCard>
                            <img src={Passed} alt="Passed Students" style={{ width: 60, height: 60 }} />
                            <Title>Students Passed</Title>
                            <Box sx={{ textAlign: 'center' }}>
                                <Data start={0} end={passedCount} duration={2.5} />
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {passPercentage.toFixed(2)}% pass rate
                                </Typography>
                            </Box>
                        </StyledCard>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        <StyledCard>
                            <img src={Failed} alt="Failed Students" style={{ width: 60, height: 60 }} />
                            <Title>Students Failed</Title>
                            <Box sx={{ textAlign: 'center' }}>
                                <Data start={0} end={failedCount} duration={2.5} />
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {(100 - passPercentage).toFixed(2)}% fail rate
                                </Typography>
                            </Box>
                        </StyledCard>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

const StyledCard = styled(Paper)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 220px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }
`;

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const Data = styled(CountUp)`
  font-size: 1.8rem;
  font-weight: bold;
  color: #4caf50;
`;

export default AdminHomePage;
import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    getError,
    postDone,
    doneSuccess
} from './teacherSlice';

export const getAllTeachers = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Teachers/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}

export const getTeacherDetails = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Teacher/${id}`);
        if (result.data) {
            dispatch(doneSuccess(result.data));
        }
    } catch (error) {
        dispatch(getError(error));
    }
}
// redux/teacherRelated/teacherHandle.js
export const addTeacherClass = (teacherId, classId) => async (dispatch) => {
    dispatch({ type: 'ADD_TEACHER_CLASS_REQUEST' });
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/Teacher/add-class`, {
            classId
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        dispatch({ type: 'ADD_TEACHER_CLASS_SUCCESS', payload: data.teacher });
        return Promise.resolve(data);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ 
            type: 'ADD_TEACHER_CLASS_FAIL', 
            payload: errorMessage 
        });
        return Promise.reject(errorMessage);
    }
};

export const removeTeacherClass = (teacherId, classId) => async (dispatch) => {
    dispatch({ type: 'REMOVE_TEACHER_CLASS_REQUEST' });
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_BASE_URL}/Teacher/remove-class`, {
            classId
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        dispatch({ type: 'REMOVE_TEACHER_CLASS_SUCCESS', payload: data.teacher });
        return Promise.resolve(data);
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({ 
            type: 'REMOVE_TEACHER_CLASS_FAIL', 
            payload: errorMessage 
        });
        return Promise.reject(errorMessage);
    }
};

export const updateTeachSubject = (teacherId, teachSubject) => async (dispatch) => {
    dispatch(getRequest());

    try {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/TeacherSubject`, { teacherId, teachSubject }, {
            headers: { 'Content-Type': 'application/json' },
        });
        dispatch(postDone());
    } catch (error) {
        dispatch(getError(error));
    }
}
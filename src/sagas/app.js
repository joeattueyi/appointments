import { put } from 'redux-saga/effects';
import { appHistory } from '../history';

export function* customerAdded({ customer }) {
    appHistory.push('/addAppointment');
}
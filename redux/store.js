import {createStore} from 'redux';
import { commonReducer } from './reducer';


export const store = createStore(commonReducer);

import Reducer from './reducer/MainReducer';
import {createStore} from 'redux';

/**
 * @desc 全局store
 * @author YS.Feng
 * @date 2021/03/22
 */
export default () => {
  return createStore(Reducer);
};

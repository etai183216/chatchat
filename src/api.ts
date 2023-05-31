import axios,{AxiosPromise} from 'axios';
import * as Interface from '../src/interface'

export default class loginClass {

    public async login (loginModel:Interface.loginModel) : AxiosPromise<any> {
        return await axios({
            method:'post',
            url:`https://localhost:7217/login`,
            data:{
                'Account':loginModel.account,
                'Password':loginModel.pw
            }
        });
    }

    public async verification(){
        return await axios({
            method:'get',
            url:`https://localhost:7217/verification`,
            headers:{
                Authorization:'bearer '+sessionStorage.getItem('Token')
            }
        })
    }
}
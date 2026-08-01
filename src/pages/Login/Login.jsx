import FormLogin from '../../components/fragments/FormLogin'
import LeftCopy from '../../components/fragments/LeftCopy'
import LoginCard from '../../components/fragments/LoginCard'
import ContentLogin from '../../components/fragments/ContentLogin'
import TagLine from '../../components/fragments/TagLine'
import LupaPassword from '../../components/fragments/LupaPassword'

const Login = ()=>{
    return(
        <ContentLogin>
            <LeftCopy />
            <LoginCard >
                <TagLine />
                <FormLogin>
                    <LupaPassword />
                </FormLogin>
            </LoginCard>
        </ContentLogin>

    );
}

export default Login
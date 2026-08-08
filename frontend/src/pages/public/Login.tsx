import Footer from "../../components/layout/Footer";
import LoginForm from "../../components/login/LoginForm";
import Title from "../../components/login/Title";

function Login(){
    return(
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <Title />
                <LoginForm />
            </main>
            <Footer />
        </div>
    )
};

export default Login;
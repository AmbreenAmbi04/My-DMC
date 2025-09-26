import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    // Check if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password
            });
            
            if (response.data.token) {
                login(response.data.token);
                // Redirect to dashboard/home page
                navigate("/");
            } else {
                setError("Login failed: No token received");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 
                                error.response?.data?.message || 
                                error.message || 
                                "Login failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="w-50">
                <h1 className="h4 fw-bold text-dark mb-4">Login</h1>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            value={email}   
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            disabled={loading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await apiClient.post('/auth/login',
                { email, password }
            );

            if (response.status === 'success') {
                login(response.user || { authenticated: true });
                toast.success('Access Granted. Welcome back!');
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.message || 'Identity verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Establish a secure session to manage your intelligence platform."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-3 block ml-1">
                        Terminal Identity
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors duration-300" size={18} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@quizora.io"
                            className="premium-input"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <label className="text-[11px] font-black text-foreground/50 uppercase tracking-[0.2em] block">
                            Access Key
                        </label>
                        <Link to="/forgot-password" underline="none" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-foreground transition-colors duration-300">
                            Recovery?
                        </Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors duration-300" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="premium-input pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors duration-300"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-primary hover:bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-500 disabled:opacity-50 mt-4 group/btn"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                        <>
                            Launch Dashboard
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
                <p className="text-foreground/40 text-[11px] font-medium">
                    New to the platform? <Link to="/register" className="text-primary font-black uppercase tracking-widest ml-2 hover:text-foreground transition-colors">Join Registry</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error("Passwords don't match");
        }

        setIsLoading(true);

        try {
            const response = await apiClient.post('/auth/register',
                { email, password }
            );

            if (response.status === 'success') {
                login(response.user || { authenticated: true });
                toast.success('Account registered successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.message || 'Registration failure');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join the Platform"
            subtitle="Create your administrative profile to start building intelligent quiz experiences."
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[11px] font-black text-foreground/50 uppercase tracking-[0.2em] mb-3 block ml-1">
                        Electronic Mail
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
                    <label className="text-[11px] font-black text-foreground/50 uppercase tracking-[0.2em] mb-3 block ml-1">
                        Security Key
                    </label>
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

                <div>
                    <label className="text-[11px] font-black text-foreground/50 uppercase tracking-[0.2em] mb-3 block ml-1">
                        Verify Key
                    </label>
                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-primary transition-colors duration-300" size={18} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="premium-input pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-primary transition-colors duration-300"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                            Register Profile
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-foreground/5 text-center">
                <p className="text-foreground/50 text-[11px] font-medium">
                    Already registered? <Link to="/login" className="text-primary font-black uppercase tracking-widest ml-2 hover:text-foreground transition-colors">Sign in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;

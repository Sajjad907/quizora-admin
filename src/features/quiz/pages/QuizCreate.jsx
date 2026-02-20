import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../shared/components/layout/Layout';
import { ChevronLeft, ArrowRight, Wand2, Loader2 } from 'lucide-react';
import { useCreateQuiz } from '../hooks/useQuizMutations';
import ErrorModal from '../../../shared/components/ui/ErrorModal';

const QuizCreate = () => {
    // 1. Hook & State Setup
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
    const navigate = useNavigate();
    const { mutate, isPending } = useCreateQuiz();
    
    // Error Handling State
    const [apiError, setApiError] = React.useState(null);

    // Watch title to auto-generate handle
    const titleValue = watch("title");
    const suggestedHandle = titleValue ? titleValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : "";

    // Handle Tab Key for Autocomplete
    const handleKeyDown = (e) => {
        if (e.key === 'Tab' && !e.target.value && suggestedHandle) {
            e.preventDefault(); // Prevent focus jump if we want to keep focus, or let it jump. 
            // Usually autocomplete implies filling it in. If we preventDefault, we stay in the field.
            // If the user wants to tab TO the next field, they can tab again.
            // Let's prevent default to show the filled value, user can tab again to move.
            setValue("handle", suggestedHandle);
        }
    };

    // 2. Submit Function (Data Save Logic)
    const onSubmit = (data) => {
        // Use suggested handle if handle is empty
        const finalData = {
            ...data,
            handle: data.handle || suggestedHandle
        };
        
        mutate(finalData, {
            onSuccess: (newQuiz) => {
                navigate(`/quiz/${newQuiz._id}/builder`);
            },
            onError: (err) => {
                setApiError(err.message || "Something went wrong while creating the quiz.");
            }
        });
    };

    return (
        <Layout>
            {/* 1. CREATION HUB HEADER */}
            <div className="mb-12 animate-reveal max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center text-muted-foreground/50 hover:text-primary transition-all mb-6 group text-xs font-black uppercase tracking-widest"
                >
                    <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Registry
                </button>
                <h1 className="text-5xl font-black tracking-[-0.04em] text-foreground">
                    New Engine
                </h1>
                <p className="text-muted-foreground mt-2 text-lg font-medium">Start building your next customized recommendation engine.</p>
            </div>

            {/* 2. CONFIGURATION FORM */}
            <div className="max-w-2xl mx-auto animate-reveal">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border/50 rounded-[40px] shadow-2xl shadow-black/5 p-12 space-y-10 relative overflow-hidden">
                    
                    {/* Decorative Background Blur */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

                    {/* Quiz Title Input */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase ml-1 flex items-center">
                            Entity Name <span className="text-primary ml-1">*</span>
                        </label>
                        <input 
                            {...register("title", { required: "Quiz title is required" })}
                            placeholder="e.g., Perfect Skincare Routine Finder"
                            className={`w-full p-6 rounded-2xl bg-card/50 border ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-border focus:ring-primary/10 focus:border-primary/30'} focus:ring-8 focus:outline-none transition-all placeholder:text-muted-foreground/20 text-2xl font-black tracking-tight shadow-sm`}
                            autoFocus
                        />
                        {errors.title && <p className="text-red-500 text-[11px] mt-2 font-black uppercase tracking-widest flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>{errors.title.message}</p>}
                    </div>

                    {/* Quiz Handle / URL Input */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase ml-1 flex items-center justify-between">
                            <span>Endpoint Handle <span className="text-[9px] font-bold text-muted-foreground/40 ml-2">(Auto-generated via Title)</span></span>
                           {titleValue && (
                                <span className="hidden sm:inline-block text-[9px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md animate-fade-in">
                                    Press <kbd className="font-mono border border-primary/20 rounded px-1">TAB</kbd> to autofill
                                </span>
                           )}
                        </label>
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 font-mono text-sm select-none">/quiz/</span>
                            <input 
                                {...register("handle")}
                                onKeyDown={handleKeyDown}
                                placeholder={suggestedHandle || "my-awesome-quiz"}
                                className="w-full pl-22 p-5 rounded-2xl bg-muted/20 border border-border focus:ring-8 focus:ring-primary/5 focus:border-primary/20 focus:outline-none transition-all font-mono text-sm font-bold group-hover:bg-card/50 pl-20"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="btn-premium glow-primary w-full h-[64px] rounded-[24px]"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Initializing...
                                </>
                            ) : (
                                <>
                                    Start Building <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* AI Helper Teaser */}
                <div className="mt-8 glass-panel rounded-[40px] p-10 flex items-center gap-8 animate-reveal border border-border/50">
                    <div className="w-20 h-20 bg-primary/5 rounded-[32px] text-primary flex items-center justify-center shrink-0 border border-primary/10 transition-transform hover:rotate-12 duration-500">
                        <Wand2 size={36} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-black text-foreground text-2xl tracking-tighter">AI Generative Logic</h3>
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm italic font-medium opacity-60">Describe your catalog, and our AI will architect the outcomes and question paths for you instantly (V2).</p>
                    </div>
                </div>
            </div>

            {/* ERROR MODAL */}
            <ErrorModal 
                isOpen={!!apiError} 
                message={apiError} 
                onClose={() => setApiError(null)} 
            />
        </Layout>
    );
};

export default QuizCreate;

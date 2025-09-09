import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, ClipboardCheck, BookOpen, Target, TrendingUp, Lightbulb, User, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-modern-cream via-modern-lightGreen/30 to-modern-beige/50 p-4">
        <div className="container max-w-6xl mx-auto">
          {/* User Welcome Header */}
          <header className="text-center py-20 mb-20">
            <div className="mb-10 flex justify-center">
              <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-elegant border border-modern-beige">
                <Brain className="w-16 h-16 text-modern-dark" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-modern-dark mb-8 tracking-tight">
              환영합니다!
            </h1>
            <p className="text-xl text-modern-green max-w-3xl mx-auto leading-relaxed font-medium mb-8">
              {user.email}님, 인지편향 테스트를 시작해보세요
            </p>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="border-2 border-modern-green text-modern-green hover:bg-modern-green hover:text-white"
            >
              로그아웃
            </Button>
          </header>

          {/* Action Cards */}
          <section className="grid md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-card transition-all duration-500 hover:-translate-y-2 group border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-modern-dark/5 via-transparent to-modern-green/5" />
              <CardContent className="relative p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-modern-dark/10 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <ClipboardCheck className="w-10 h-10 text-modern-dark" />
                  </div>
                  <h2 className="text-2xl font-black text-modern-dark mb-4">
                    테스트 시작
                  </h2>
                  <p className="text-modern-green leading-relaxed mb-8 font-light">
                    인지편향 테스트를 통해 객관적 사고력을 진단해보세요.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/bias-test')}
                  className="w-full bg-modern-dark hover:bg-modern-green text-white transition-all duration-300 text-base py-6 font-medium rounded-xl"
                  size="lg"
                >
                  테스트 시작하기
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-card transition-all duration-500 hover:-translate-y-2 group border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-modern-green/5 via-transparent to-modern-beige/5" />
              <CardContent className="relative p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-modern-green/10 rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-10 h-10 text-modern-green" />
                  </div>
                  <h2 className="text-2xl font-black text-modern-dark mb-4">
                    학습 자료
                  </h2>
                  <p className="text-modern-green leading-relaxed mb-8 font-light">
                    인지편향에 대한 상세한 학습 자료를 확인하세요.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/correction/확증편향')}
                  variant="outline"
                  className="w-full border-2 border-modern-green text-modern-green hover:bg-modern-green hover:text-white transition-all duration-300 text-base py-6 font-medium rounded-xl"
                  size="lg"
                >
                  학습 자료 보기
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-modern-cream via-modern-lightGreen/30 to-modern-beige/50 p-4">
      <div className="container max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="text-center py-20 mb-20">
          <div className="mb-10 flex justify-center">
            <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-elegant border border-modern-beige">
              <Brain className="w-16 h-16 text-modern-dark" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-modern-dark mb-8 tracking-tight">
            무료 인지편향 테스트
          </h1>
          <p className="text-xl text-modern-green max-w-3xl mx-auto leading-relaxed font-medium">
            연구자들의 객관적 사고를 위한 과학적 진단 도구
            <br />
            <span className="text-modern-dark/70 font-light">정확한 분석으로 더 나은 의사결정을 만들어보세요</span>
          </p>
        </header>

        {/* Login Section */}
        <section className="max-w-md mx-auto mb-20">
          <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-elegant">
            <div className="absolute inset-0 bg-gradient-to-br from-modern-dark/5 via-transparent to-modern-green/5" />
            <CardContent className="relative p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-modern-dark/10 rounded-2xl mb-6">
                  <User className="w-8 h-8 text-modern-dark" />
                </div>
                <h2 className="text-2xl font-black text-modern-dark mb-4">
                  {isSignUp ? '회원가입' : '로그인'}
                </h2>
                <p className="text-modern-green font-light">
                  테스트 결과를 저장하고 관리하세요
                </p>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-modern-dark font-medium">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-modern-green" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-modern-beige focus:border-modern-green"
                      placeholder="이메일을 입력하세요"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-modern-dark font-medium">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-modern-green" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-modern-beige focus:border-modern-green"
                      placeholder="비밀번호를 입력하세요"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-modern-dark hover:bg-modern-green text-white transition-all duration-300 py-6 font-medium rounded-xl"
                >
                  {loading ? '처리중...' : (isSignUp ? '회원가입' : '로그인')}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-modern-green hover:text-modern-dark transition-colors font-medium"
                >
                  {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Preview */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-modern-dark mb-6">
              객관적 사고력 향상하기
            </h2>
            <p className="text-xl text-modern-green max-w-3xl mx-auto leading-relaxed font-light">
              과학적 진단을 통해 더 나은 의사결정을 만들어보세요.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 group hover:-translate-y-1">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-modern-dark/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-modern-dark" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-modern-dark">
                객관적 사고
              </h3>
              <p className="text-modern-green leading-relaxed font-light">
                편향된 사고 패턴을 인식하고 
                더욱 객관적인 판단을 내릴 수 있습니다.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 group hover:-translate-y-1">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-modern-green/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-modern-green" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-modern-dark">
                연구 품질 향상
              </h3>
              <p className="text-modern-green leading-relaxed font-light">
                체계적인 편향 교정으로 
                연구의 신뢰성과 타당성을 높입니다.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl hover:bg-white/80 transition-all duration-300 group hover:-translate-y-1">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-modern-beige/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-modern-dark" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-modern-dark">
                지속적 학습
              </h3>
              <p className="text-modern-green leading-relaxed font-light">
                다양한 학습 콘텐츠로 
                꾸준한 자기개발이 가능합니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;

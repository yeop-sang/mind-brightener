import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ClipboardCheck, BookOpen, Target, TrendingUp, Lightbulb } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

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
                  테스트 완료
                </h2>
                <p className="text-modern-green leading-relaxed mb-8 font-light">
                  어떠한 성격 유형을 확인할 수 있도록 도와주세요.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/bias-test')}
                className="w-full bg-modern-dark hover:bg-modern-green text-white transition-all duration-300 text-base py-6 font-medium rounded-xl"
                size="lg"
              >
                성격 <span className="font-bold">무료</span> 검사
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
                  상세 결과 보기
                </h2>
                <p className="text-modern-green leading-relaxed mb-8 font-light">
                  어떠한 성격 유형의 심층 다양한 영역에 어떤 영향을
                  미치는지 알아보세요.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/correction/확증편향')}
                variant="outline"
                className="w-full border-2 border-modern-green text-modern-green hover:bg-modern-green hover:text-white transition-all duration-300 text-base py-6 font-medium rounded-xl"
                size="lg"
              >
                프리미엄 자료 통해 완전는 사업자세요
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-modern-dark mb-6">
              어떠분의 잠재력을 모두 발휘하세요
            </h2>
            <p className="text-xl text-modern-green max-w-3xl mx-auto leading-relaxed font-light">
              프리미엄 자료를 통해 완전는 사업자세요.
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

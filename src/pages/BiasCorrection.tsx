import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, BookOpen, Play } from "lucide-react";
import confirmationBias1 from "@/assets/confirmation-bias-1.jpg";
import confirmationBias2 from "@/assets/confirmation-bias-2.jpg";

const biasContent = {
  "확증편향": {
    webtoon: {
      title: "확증편향 극복하기 - 웹툰",
      panels: [
        {
          image: confirmationBias1,
          text: "박사님, 새로운 실험 결과가 나왔는데... 기존 가설과 완전히 다른 결과예요."
        },
        {
          image: confirmationBias2, 
          text: "흠... 실험에 오류가 있었나? 다시 한 번 확인해보자."
        },
        {
          image: "https://via.placeholder.com/640x512/E24A4A/FFFFFF?text=Warning+About+Bias",
          text: "잠깐! 이런 반응이 바로 확증편향이에요. 결과를 객관적으로 먼저 분석해봐야 합니다."
        },
        {
          image: "https://via.placeholder.com/640x512/50C878/FFFFFF?text=Learning+Success",
          text: "맞네요. 데이터가 말하는 것을 먼저 들어보고, 가설을 수정하는 것이 과학적 접근이군요!"
        }
      ]
    },
    animation: {
      title: "확증편향 이해하기 - 애니메이션",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "확증편향이 과학 연구에 미치는 영향과 이를 극복하는 방법을 애니메이션으로 설명합니다."
    }
  },
  "가용성편향": {
    webtoon: {
      title: "가용성 편향 극복하기 - 웹툰",
      panels: [
        {
          image: "https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Panel+1",
          text: "최근에 비슷한 연구가 실패했다는 소식을 들었어. 우리 연구도 위험할 것 같아."
        },
        {
          image: "https://via.placeholder.com/400x300/E24A4A/FFFFFF?text=Panel+2",
          text: "그것은 가용성 편향일 수 있어요. 최근 사례가 전체를 대표하지는 않아요."
        },
        {
          image: "https://via.placeholder.com/400x300/50C878/FFFFFF?text=Panel+3",
          text: "통계적 데이터를 찾아보니 성공률이 생각보다 높네요. 객관적 자료가 중요하군요!"
        }
      ]
    },
    animation: {
      title: "가용성 편향 이해하기 - 애니메이션",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "최근 경험이 판단에 미치는 영향과 객관적 분석의 중요성을 보여줍니다."
    }
  }
};

const BiasCorrection = () => {
  const { biasName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contentType = searchParams.get('type') || 'webtoon';

  const content = biasContent[biasName as keyof typeof biasContent];
  
  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-calm-blue flex items-center justify-center">
        <Card className="shadow-card animate-scale-in max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">콘텐츠를 찾을 수 없습니다</h2>
            <Button onClick={() => navigate('/')} variant="hero">
              메인으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (contentType === 'animation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-calm-blue py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/results')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              결과로 돌아가기
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
              {content.animation.title}
            </h1>
          </div>

          <Card className="shadow-card animate-scale-in">
            <CardContent className="p-6">
              <div className="aspect-video w-full mb-4">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={content.animation.videoUrl}
                  title={content.animation.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
              <p className="text-muted-foreground">{content.animation.description}</p>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={() => navigate(`/correction/${biasName}`)}
              variant="outline"
              className="flex-1"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              웹툰으로 보기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-blue py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/results')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            결과로 돌아가기
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
            {content.webtoon.title}
          </h1>
        </div>

        <div className="space-y-6">
          {content.webtoon.panels.map((panel, index) => (
            <Card key={index} className="shadow-card animate-scale-in" style={{animationDelay: `${index * 0.2}s`}}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <img 
                    src={panel.image} 
                    alt={`Panel ${index + 1}`}
                    className="w-full md:w-96 h-64 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-lg text-foreground leading-relaxed">
                      {panel.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Button 
            onClick={() => navigate(`/correction/${biasName}?type=animation`)}
            variant="outline"
            className="flex-1"
          >
            <Play className="mr-2 h-4 w-4" />
            애니메이션으로 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BiasCorrection;
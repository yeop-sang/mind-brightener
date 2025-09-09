import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Question {
  id: number;
  text: string;
  bias: string;
}

const questions: Question[] = [
  { id: 1, text: "새로운 연구 결과가 내 기존 가설과 다르면, 그 결과를 의심하는 편이다", bias: "confirmation" },
  { id: 2, text: "과거에 성공한 방법이라면 새로운 상황에서도 잘 작동할 것이라고 생각한다", bias: "availability" },
  { id: 3, text: "첫 번째로 얻은 정보나 인상이 후속 판단에 큰 영향을 준다", bias: "anchoring" },
  { id: 4, text: "연구 성과가 좋을 때는 내 능력 덕분이고, 나쁠 때는 외부 요인 때문이라고 생각한다", bias: "attribution" },
  { id: 5, text: "통계적으로 드문 사건이라도 최근에 경험했다면 자주 일어날 것 같다고 느낀다", bias: "availability" },
  { id: 6, text: "내가 전문 분야가 아닌 영역에서도 내 판단이 정확할 것이라고 생각한다", bias: "overconfidence" },
  { id: 7, text: "연구 과정에서 예상과 다른 결과가 나오면 실험 오류부터 의심한다", bias: "confirmation" },
  { id: 8, text: "동료들의 의견보다는 내 직감을 더 신뢰하는 편이다", bias: "overconfidence" }
];

const BiasTest = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const navigate = useNavigate();

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    localStorage.setItem('biasTestResults', JSON.stringify(answers));
    navigate('/results');
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-blue py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
            인지편향 자가진단 검사
          </h1>
          <p className="text-muted-foreground animate-fade-in">
            각 문항을 읽고 자신에게 해당하는 정도를 선택해주세요
          </p>
        </div>

        <Card className="shadow-card animate-scale-in">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              진단 문항 ({Object.keys(answers).length}/8)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3 pb-6 border-b border-border last:border-b-0">
                <p className="font-medium text-foreground">
                  {index + 1}. {question.text}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">전혀 그렇지 않다</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswerChange(question.id, value)}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                          answers[question.id] === value
                            ? 'bg-science-primary border-science-primary text-white shadow-button'
                            : 'border-border hover:border-science-primary hover:bg-science-accent'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">매우 그렇다</span>
                </div>
              </div>
            ))}
            
            <div className="pt-6">
              <Button 
                onClick={handleSubmit}
                disabled={!allAnswered}
                variant="hero"
                size="lg"
                className="w-full"
              >
                결과 확인하기
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BiasTest;
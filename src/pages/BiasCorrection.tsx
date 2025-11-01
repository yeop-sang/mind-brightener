import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Play } from "lucide-react";
import { biasList } from "@/lib/bias";

const BiasCorrection = () => {
  const { biasName, type } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const bias = biasList.find(
    (b: any) =>
      b.biasName.replaceAll(" ", "-").toLowerCase() ===
      (biasName || "").toLowerCase()
  );

  if (!bias) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-calm-green flex items-center justify-center">
        <Card className="shadow-card animate-scale-in max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-black mb-4 text-foreground">
              콘텐츠를 찾을 수 없습니다
            </h2>
            <Button onClick={() => navigate("/results")} variant="hero">
              결과로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const contentList = type === "animation" ? bias.animationUrl : bias.videoUrl;
  const hasMultiple = contentList.length > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-calm-green py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/results")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          결과로 돌아가기
        </Button>

        {/* Title */}
        <h1 className="text-3xl font-black text-foreground mb-6 animate-fade-in">
          {bias.biasNameKor}
        </h1>

        {/* Tab Buttons if multiple contents */}
        {hasMultiple && (
          <div className="flex justify-center gap-2 mb-4">
            {contentList.map((_, index) => (
              <Button
                key={index}
                variant={index === currentIndex ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentIndex(index)}
              >
                Content {index + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Content Card */}
        <Card className="shadow-card animate-scale-in">
          <CardContent className="p-6">
            {type === "animation" ? (
              <div className="flex flex-col items-center">
                <img
                  src={contentList[currentIndex]}
                  alt={`${bias.biasNameKor} Webtoon ${currentIndex + 1}`}
                  className="w-full rounded-lg mb-6"
                />
                <p className="text-muted-foreground font-light text-center">
                  {bias.description}
                </p>
              </div>
            ) : (
              <div>
                <div className="aspect-video w-full mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src={contentList[currentIndex]}
                    title={`${bias.biasNameKor} Video ${currentIndex + 1}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
                <p className="text-muted-foreground font-light text-center">
                  {bias.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Switch Mode Button */}
        <div className="mt-6 flex gap-4">
          {type === "animation" ? (
            <Button
              onClick={() => navigate(`/correction/${biasName}/video`)}
              variant="outline"
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              비디오로 보기
            </Button>
          ) : (
            <Button
              onClick={() => navigate(`/correction/${biasName}/animation`)}
              variant="outline"
              className="flex-1"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              웹툰으로 보기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiasCorrection;

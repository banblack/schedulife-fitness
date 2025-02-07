
import { Card } from "@/components/ui/card";

const News = () => {
  const articles = [
    {
      title: "The Benefits of High-Intensity Interval Training",
      excerpt: "Discover why HIIT workouts are becoming increasingly popular...",
      category: "Training",
      readTime: "5 min read"
    },
    {
      title: "Nutrition Tips for Muscle Growth",
      excerpt: "Learn about the essential nutrients needed for muscle development...",
      category: "Nutrition",
      readTime: "4 min read"
    },
    {
      title: "Best Recovery Practices for Athletes",
      excerpt: "Expert advice on optimizing your post-workout recovery...",
      category: "Recovery",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="container px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Fitness News</h1>
      
      <div className="space-y-6">
        {articles.map((article, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {article.category}
                </span>
                <span className="text-sm text-neutral">{article.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              <p className="text-neutral">{article.excerpt}</p>
              <button className="mt-4 text-primary hover:text-primary/80 transition-colors">
                Read More
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default News;

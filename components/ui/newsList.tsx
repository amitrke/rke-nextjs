import { NewsArticle } from "../../service/PostService";
import NewsListItem from "./newsListItem";

type NewsListProps = {
    news: NewsArticle[];
};

export default function NewsList({ news }: NewsListProps) {
    return (
        <div className="row">
            {news.map((article) => (
                <NewsListItem key={article.link} article={article} />
            ))}
        </div>
    );
}

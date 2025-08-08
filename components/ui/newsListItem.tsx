import { NewsArticle } from "../../service/PostService";

type NewsListItemProps = {
    article: NewsArticle;
};

export default function NewsListItem({ article }: NewsListItemProps) {
    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
                {article.urlToImage && (
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        width={300}
                        height={200}
                        style={{ objectFit: 'cover' }}
                        className="card-img-top"
                    />
                )}
                <div className="card-body">
                    <h5 className="card-title">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.title}
                        </a>
                    </h5>
                    <p className="card-text">{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="stretched-link">
                        Read More
                    </a>
                </div>
                <div className="card-footer">
                    <small className="text-muted">
                        {article.formattedPubDate} - {article.source_id}
                    </small>
                </div>
            </div>
        </div>
    );
}

import { NewsArticle } from "../../service/PostService";

type NewsListItemProps = {
    article: NewsArticle;
};

export default function NewsListItem({ article }: NewsListItemProps) {
    return (
        <div className="mb-4 w-full px-3 md:w-1/2 lg:w-1/3">
            <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
                {article.image_url && (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        width={300}
                        height={200}
                        style={{ objectFit: 'cover' }}
                        className="h-48 w-full object-cover"
                    />
                )}
                <div className="flex flex-1 flex-col p-4">
                    <h5 className="mb-2 text-lg font-semibold">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-blue-700">
                            {article.title}
                        </a>
                    </h5>
                    <p className="mb-3 text-sm text-slate-700">{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-auto text-sm font-medium text-blue-700 hover:text-blue-800">
                        Read More
                    </a>
                </div>
                <div className="border-t border-slate-200 px-4 py-3">
                    <small className="text-slate-500">
                        {article.formattedPubDate} - {article.source_id}
                    </small>
                </div>
            </div>
        </div>
    );
}

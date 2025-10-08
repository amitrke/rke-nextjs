import Link from 'next/link';
import { Button, ButtonGroup } from 'react-bootstrap';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    basePath: string;
};

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    // Generate smart pagination with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7; // Show max 7 page buttons

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
            pages.push('...');
        }

        // Show current page and neighbors
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="d-flex justify-content-center my-4">
            <ButtonGroup>
                <Link href={currentPage > 1 ? `${basePath}/${currentPage - 1}`: `${basePath}/${currentPage}`} passHref>
                    <Button variant="secondary" disabled={currentPage <= 1}>
                        Previous
                    </Button>
                </Link>
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <Button key={`ellipsis-${index}`} variant="secondary" disabled>
                                ...
                            </Button>
                        );
                    }
                    return (
                        <Link key={page} href={`${basePath}/${page}`} passHref>
                            <Button variant={currentPage === page ? 'primary' : 'secondary'}>
                                {page}
                            </Button>
                        </Link>
                    );
                })}
                <Link href={currentPage < totalPages ? `${basePath}/${currentPage + 1}` : `${basePath}/${currentPage}`} passHref>
                    <Button variant="secondary" disabled={currentPage >= totalPages}>
                        Next
                    </Button>
                </Link>
            </ButtonGroup>
        </div>
    );
}

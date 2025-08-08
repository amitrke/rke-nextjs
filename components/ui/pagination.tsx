import Link from 'next/link';
import { Button, ButtonGroup } from 'react-bootstrap';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    basePath: string;
};

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="d-flex justify-content-center my-4">
            <ButtonGroup>
                <Link href={`${basePath}/${currentPage - 1}`} passHref>
                    <Button variant="secondary" disabled={currentPage <= 1}>
                        Previous
                    </Button>
                </Link>
                {pages.map((page) => (
                    <Link key={page} href={`${basePath}/${page}`} passHref>
                        <Button variant={currentPage === page ? 'primary' : 'secondary'}>
                            {page}
                        </Button>
                    </Link>
                ))}
                <Link href={`${basePath}/${currentPage + 1}`} passHref>
                    <Button variant="secondary" disabled={currentPage >= totalPages}>
                        Next
                    </Button>
                </Link>
            </ButtonGroup>
        </div>
    );
}

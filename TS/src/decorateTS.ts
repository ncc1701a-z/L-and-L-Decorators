import { ImportantDecorator, LogTimingDecorator, TimingDecorator } from "./decorators/perfDecorators";
import { delay } from "./helpers";
import Book from "./models/book.model";

const books: Array<Book> = [
    new Book('978-0131177055', 'Working Effectively with Legacy Code', 'Michael Feathers', 2016),
    new Book('978-0137081073', 'The Clean Coder', 'Robert Martin', 2011),
    new Book('978-0735619678', 'Code Complete: A Practical Handbook of Software Construction', 'Steve McConnell', 2004),
    new Book('978-0135957059', 'The Pragmatic Programmer', 'David Thomas', 2019),
    new Book('978-1617292392', 'Soft Skills: The Software Developer\'s Life Manual', 'John Sonmez', 2015),
];


@LogTimingDecorator
class BookRepository {
    books: Array<Book>;

    constructor(books: Array<Book>) {
        this.books = books;
    }

    @TimingDecorator(true)
    async getBookById(@ImportantDecorator id: string): Promise<Book | undefined> {
        return delay(50, this.books.find((p) => { return p.id == id }));
    };
}


(async function () {
    const bookRepo = new BookRepository(books);

    const lookup = ['978-0131177055', '978-0137081073', '978-0137081073', '978-0735619678', '978-1617292392', '978-0735619678', '978-1617292392', '978-0131177055'];

    for(const id of lookup) {
        const response: any = await bookRepo.getBookById(id);
        console.log(`Got ${JSON.stringify(response)}`);
    }

    // @ts-ignore
    bookRepo?.printTimings()
}());
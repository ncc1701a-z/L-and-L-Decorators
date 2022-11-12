export default class Book {
    id: string;
    time: string;
    author: string;
    yearofPublication: number;    

    constructor(id: string, title: string, author: string, yearofPublication: number) {
        this.id = id;
        this.time = title;
        this.author = author;
        this.yearofPublication = yearofPublication;
    }
}
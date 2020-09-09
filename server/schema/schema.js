const graphql = require('graphql');
// const _ = require('lodash');
// const Book = require('../models/book')
// const Author = require('../models/author')

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
 } = graphql;

var books = [
    {name: 'Java', genre:'AShish', id:'1', authorId:'1'},
    {name: 'JavaScript', genre:'Ashish', id:'2', authorId:'2'},
    {name: 'PHP', genre:'Sumit', id:'3', authorId:'3'},
    {name: 'Java 1', genre:'AShish', id:'4', authorId:'1'},
    {name: 'JavaScript 1', genre:'Ashish', id:'5', authorId:'2'},
    {name: 'PHP 1', genre:'Sumit', id:'6', authorId:'3'},
];

var authors = [
    {name: 'Ashish Nimrot', age:44, id:'1'},
    {name: 'Sumit Nimrot', age:42, id:'2'},
    {name: 'Sameer Nimrot', age:62, id:'3'},
]

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields:() => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books.filter(o => o.authorId == parent.id);
            }
        }
    })
});

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields:() => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                console.log(parent);
                return authors.find(o => o.id == parent.authorId)
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:() =>({
        book:{
            type: BookType,
            args:{id: {type: GraphQLID}},
            resolve(parent, args){
                console.log(typeof(args.id))
                return books.find(o => o.id == args.id)
            }
        },
        author:{
            type: AuthorType,
            args:{id: {type: GraphQLID}},
            resolve(parent, args){
                console.log(typeof(args.id))
                return authors.find(o => o.id == args.id)
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books;
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return authors;
            }
        }

    }),
})

const Mutations = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor: {
            type: AuthorType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
            },
            resolve(parent, args){
                console.log(args);
                const maxAuthorId = Math.max.apply(Math, authors.map(o => o.id))
                let author = {
                    name: args.name,
                    age: args.age,
                    id: maxAuthorId + 1,
                }
                authors.push(author);
                return authors.find(o => o.id == author.id)
                // return _.find(authors, {id: author.id});
                // let author = new Author({
                //     name: args.name,
                //     age: args.age
                // });
                // author.save();
            }
        },
        addBook:{
            type: BookType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLInt},
            },
            resolve(parent, args){
                console.log(args);
                const maxBookId = Math.max.apply(Math, books.map(o => o.id))
                console.log(maxBookId)

                let book = {
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId,
                    id: maxBookId + 1,  
                }
                books.push(book);
                return books.find(o => o.id == book.id);
                // return _.find(books, {id: book.id});
                // let book = new Book({
                //     name: args.name,
                //     genre: args.genre,
                //     authorId: args.authorId,
                // })
                // book.save();
            }
        }
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutations,
})


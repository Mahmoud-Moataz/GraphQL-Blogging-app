import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: 'thisismysupersecrettext',
  fragmentReplacements,
});

export { prisma as default };

// const creatPostForUser = async (authorId, data) => {
//   const userExist = await prisma.exists.User({ id: authorId });

//   if (!userExist) throw new Error("user not found");

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId,
//           },
//         },
//       },
//     },
//     "{author{id name posts{id title body published}}}"
//   );

//   return post.author;
// };

// // creatPostForUser("ckeqaq9ot01cr0795wifr4um2", {
// //   title: "great books to read",
// //   body: "the war of art",
// //   published: true,
// // })
// //   .then((user) => {
// //     console.log(JSON.stringify(user, undefined, 2));
// //   })
// //   .catch((error) => {
// //     console.log(error.message);
// //   });

// const updatePostForUser = async (postId, data) => {
//   const postExist = await prisma.exists.Post({ id: postId });

//   if (!postExist) throw new Error("post not found");

//   const post = await prisma.mutation.updatePost(
//     {
//       where: {
//         id: postId,
//       },
//       data,
//     },
//     "{author{id name posts{id title body published}}}"
//   );

//   return post.author;
// };

// updatePostForUser("ckernkmn1004m0795y3ltwhk8", {
//   body: "prisma is a great tool",
// })
//   .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Graphql 101",
//         body: "",
//         published: false,
//         author: {
//           connect: {
//             id: "ckeqaq9ot01cr0795wifr4um2",
//           },
//         },
//       },
//     },
//     "{id title body published}"
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.users(
//       null,
//       "{id name email posts{title body published}}"
//     );
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// prisma.mutation
//   .updatePost(
//     {
//       where: {
//         id: "ckernkmn1004m0795y3ltwhk8",
//       },
//       data: {
//         body: "new post booooody",
//         published: true,
//       },
//     },
//     "{id title body published}"
//   )
//   .then((data) => {
//     return prisma.query.posts(null, "{id title body published}");
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

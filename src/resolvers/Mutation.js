import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password,
      },
    });

    return {
      user,
      token: generateToken(user.id),
    };

    //OR (two solutionsare identical)
    // const user = await prisma.mutation.createUser({ data: args.data }, info);

    // return user;
  },

  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    //OR (two solutions are identical)
    // const deletedUser = await prisma.mutation.deleteUser(
    //   { where: { id: args.id } },
    //   info
    // );

    // return deletedUser;
  },

  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      { where: { id: userId }, data: args.data },
      info
    );
  },

  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: { email: args.data.email },
    });
    if (!user) throw new Error('unable to login');
    const isMatch = await bcrypt.compare(args.data.password, user.password);
    if (!isMatch) throw new Error('unable to login');

    return {
      user,
      token: generateToken(user.id),
    };
  },

  createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
  },

  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExist = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExist) throw new Error('unable to delete post');

    return prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },

  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExist = await prisma.exists.Post({
      id: args.id,
      author: { id: userId },
    });
    if (!postExist) throw new Error('unable to update post');

    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true,
    });

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: { post: { id: args.id } },
      });
    }
    return prisma.mutation.updatePost(
      { where: { id: args.id }, data: args.data },
      info
    );
  },

  createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExist = prisma.query.post({ id: args.data.id, published: true });
    if (!postExist) throw new Error('unable to find post');
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: args.data.post,
            },
          },
        },
      },
      info
    );
  },

  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author: { id: userId },
    });
    if (!commentExist) throw new Error('unable to delete comment ');
    return prisma.mutation.deleteComment({ where: { id: args.id } }, info);
  },

  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExist = await prisma.exists.Comment({
      id: args.id,
      author: { id: userId },
    });
    if (!commentExist) throw new Error('unable to update comment ');

    return prisma.mutation.updateComment(
      { where: { id: args.id }, data: args.data },
      info
    );
  },
};

export { Mutation as default };

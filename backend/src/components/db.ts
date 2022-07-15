import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const makeOrder = (_name: string, _image?: string, _category?: string | number) => {
    console.log('-----------------');
    console.log(typeof _category);
    console.log(_category);
    return {
        name: _name,
        image: (_image) ? _image : undefined,
        category: (!_category) ? undefined : ( 
            (typeof(_category) == "string") ? 
                { connect: { name: _category } } : 
                { connect: { id: _category } }
        )
    }
}

const createNewCategory = async (name: string) => {
    await prisma.category.create({
        data: {
            name: name
        }
    })
    .then((newCategory) => console.log("new category -> ", newCategory.id, newCategory.name))
    .catch((err) => console.log(err))
    .finally(async () => await prisma.$disconnect());
}

const createNewOrder = async (_name: string, _image?: string, _category?: string | number) => {
    const newItem = await prisma.item.create({
        data: makeOrder(_name, _image, _category)
    })
    .catch((err) => console.log(err))
    .finally(async () => await prisma.$disconnect());
    return newItem;
}

const patchOrder = async (_id: number, _name: string, _image?: string, _category?: string | number) => {
    await prisma.item.update({
        data: makeOrder(_name, _image, _category),
        where: {
            id: _id,
        }
    })
}

const orderDone = async (_id: number, _flag: boolean) => {
    await prisma.item.update({
        data: {
            isActive: _flag,
        }, 
        where: {
            id: _id,
        }
    })
}

const showCategories = async () => await prisma.category.findMany();

const showOrders = async () => await prisma.item.findMany({
    include: {category: true},
    where: {
        isActive: true,
    },
    orderBy: {
        id: 'desc',
    }

});

const showLastOrder = async () => await prisma.item.findFirst({
    include: {category: true},
    orderBy: {
        id: 'desc',
    }
});

export { createNewCategory, 
        createNewOrder, 
        showOrders, 
        showCategories, 
        showLastOrder, 
        patchOrder,
        orderDone
};


const express = require("express");

const {PrismaClient} = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// to fetch the single restaurant details by Id

app.get('/restaurant/:restaurantId',async(request,response)=>{

    const {restaurantId} = request.params;

    try{

        const restaurant = await prisma.restaurant.findUnique({
            where: {id:parseInt(restaurantId)},
        });

        if (!restaurant) {
            return response.status(400).json({error:'Restaurant not found'})
        }

        response.json(restaurant);
    } catch(error){
        console.error('Error fetching restaurant:', error);
        response.status(500).json({error:"Internal server error"});
    }
});

// to create a new restaurant 

app.post('/restaurant' ,async(request,response)=>{
    const {name,since,isOpen,opsStartTime,opsEndTime,ownerId,slug,description,location} = request.body;

    try{
        const newRestaurant = await  prisma.restaurant.create({
            data:{
                name,
                since:new Date(since),
                isOpen,
                opsStartTime:new Date(opsStartTime),
                opsEndTime:new Date(opsEndTime),
                ownerId,
                slug,
                description,
                location,
            },
        });
        response.status(201).json(newRestaurant);
    } catch(error){
        console.error('Error creating restaurant:', error);
        response.status(500).json({error:"Internal server error"});
    }
});

// to update the already existing restaurant

app.put('/restaurant/:restaurantId', async (request,response)=>{

    const {restaurantId} = request.params;

    const {name,since,isOpen, opsStartTime,opsEndTime,ownerId,slug,description,location} = request.body;

    try{
        const updatedRestaurant = await prisma.restaurant.update({

            where: { id: parseInt(restaurantId)},

            data:{
                 name,
                 since :new Date( since),
                 isOpen,
                 opsStartTime: new Date(opsStartTime),
                 opsEndTime: new Date(opsEndTime),
                  ownerId,
                  slug,
                  description,
                  location,
            },

        });
        response.json(updatedRestaurant);
    } catch (error){
        console.error("Error updating restaurant:", error);
        response.status(500).json({error:'Internal server error'});
    }
});

// to delete a particular restaurant 

app.delete("/restaurant/:restaurantId", async (request,response)=>{

    const {restaurantId} = request.params;

    try{
        await prisma.restaurant.delete({

            where: {id: parseInt(restaurantId)},

        });
        response.status(204).end();
    } catch(error){
        console.error('Error deleting restaurant:', error);
        response.status(500).json({error:'Internal server error'});
    }

});

// to search  multiple restaurant based on couponcode and city

app.post('/restaurant/search', async(request,response)=>{

    const {location, couponCode} = request.body;

    try {

        const restaurants = await prisma.restaurant.findMany({
            where: {
                location: {
                    equals: location,
                },
                menuItems: {
                    some: {
                        couponCode: {
                            equals: couponCode,
                        },
                    },
                },
            },
            include: {
                menuItems: true,
            },
        });
        response.json(restaurants);
    } catch (error) {
        console.error('Error searching for restaurants:', error);
        response.status(500).json({ error:'Internal server error'});
    }
});

//  populating the database with 5 restaurants 

async function populateDatabase(){

    try {

        const restaurantCount = await prisma.restaurant.count();

        if (restaurantCount === 0) {

            const restaurants = await prisma.restaurant.createMany({

                data: [

                    {
                        name: "Tabala",
                        since: new Date(),
                        isOpen: true,
                        opsStartTime:new Date(),
                        opsEndTime: new Date(),
                        ownerId: 1,
                        slug: 'restaurant-1',
                        description: 'Nice place and good Ambience',
                        location: 'Hyderabad',
                        menuItems: {
                            create : [
                                {
                                    name: 'Chicken biryani',
                                    description: 'Chicken biryani is very famous',
                                     price: 250,
                                      couponCode: ["HUNGRY25"],
                                },
                                {
                                    name: 'Fired Rice',
                                    description: 'Mixed with egg and chicken pieces ',
                                     price: 150,
                                      couponCode: ["HUNGRY50"],
                                },
                            ],
                        },
                    },

                    {
                        name: "Bawarchi",
                        since: new Date(),
                        isOpen: true,
                        opsStartTime:new Date(),
                        opsEndTime: new Date(),
                        ownerId: 2,
                        slug: 'restaurant-2',
                        description: 'Nice place and good Ambience',
                        location: 'Hyderabad',
                        menuItems: {
                            create : [
                                {
                                    name: 'Chicken biryani',
                                    description: 'Chicken biryani is very famous',
                                     price: 250,
                                      couponCode: ["HUNGRY25"],
                                },
                                {
                                    name: 'Mutton Biryani',
                                    description: 'Delicious biryani',
                                     price: 350,
                                      couponCode: ["HUNGRY50"],
                                },

                                {
                                    name: ' fish Biryani',
                                    description: 'the best ever fish biryani',
                                     price: 400,
                                      couponCode: ["HUNGRY50"],
                                },
                            ],
                        },
                    },
                    {
                        name: "subbaiah",
                        since: new Date(),
                        isOpen: true,
                        opsStartTime:new Date(),
                        opsEndTime: new Date(),
                        ownerId: 3,
                        slug: 'restaurant-3',
                        description: 'Nice place and good Ambience',
                        location: 'Bangalore',
                        menuItems: {
                            create : [
                                {
                                    name: 'Chicken biryani',
                                    description: 'Chicken biryani is very famous',
                                     price: 250,
                                      couponCode: ["HUNGRY25"],
                                },
                                {
                                    name: 'Natu kodi pulusu',
                                    description: 'It is very good',
                                     price: 150,
                                      couponCode: ["HUNGRY50"],
                                },
                            ],
                        },
                    },
                    {
                        name: "Murugan Restaurant",
                        since: new Date(),
                        isOpen: true,
                        opsStartTime:new Date(),
                        opsEndTime: new Date(),
                        ownerId: 4,
                        slug: 'restaurant-4',
                        description: 'Nice place and good Ambience',
                        location: 'Chennai',
                        menuItems: {
                            create : [
                                {
                                    name: 'Chicken biryani',
                                    description: 'Chicken biryani is very famous',
                                     price: 250,
                                      couponCode: ["HUNGRY25"],
                                },
                                {
                                    name: 'Sambar rice ',
                                    description: 'Delicious sambar rice',
                                     price: 100,
                                      couponCode: ["HUNGRY50"],
                                },
                                {
                                    name: 'Thatuu Idly ',
                                    description: 'Nice and soft',
                                     price: 50,
                                      couponCode: ["HUNGRY50"],
                                },
                                {
                                    name: 'Natu kodi pulusu',
                                    description: 'It is very good',
                                     price: 150,
                                      couponCode: ["HUNGRY50"],
                                },
                            ],
                        },
                    },
                    {
                        name: "Paradise",
                        since: new Date(),
                        isOpen: true,
                        opsStartTime:new Date(),
                        opsEndTime: new Date(),
                        ownerId: 5,
                        slug: 'restaurant-5',
                        description: 'Nice place and good Ambience',
                        location: 'Hyderabad',
                        menuItems: {
                            create : [
                                {
                                    name: 'Chicken curry',
                                    description: 'Chicken curry is very famous',
                                     price: 150,
                                      couponCode: ["HUNGRY25"],
                                },
                                {
                                    name: 'Sambar rice ',
                                    description: 'Delicious sambar rice',
                                     price: 100,
                                      couponCode: ["HUNGRY50"],
                                },
                                {
                                    name: 'Thatuu Idly ',
                                    description: 'Nice and soft',
                                     price: 50,
                                      couponCode: ["HUNGRY50"],
                                },
                            ],
                        },
                    },
                ],
                include:{ 
                    menuItems:true,

                },
            });
            console.log("Successsfully populated database with ${restaurants.count} restaurants.")
        } else {
            console.log('Database already contains restaurants. Skipping population.');
        }
    } catch (error) {
        console.error('Error Populating restaurants:', error);
    } finally{
        await prisma.$disconnect();
    }
}

populateDatabase();

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
});
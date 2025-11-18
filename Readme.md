Markdown

## Mongoose Express Typescript CRUD

#### Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/buariful/lvl2-assignment2.git

   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server locally:
   ```bash
   npm run start:dev
   ```

#### End points

1. Create an user POST, /api/users
   ```json
   {
     "userId": 4,
     "username": "username4",
     "password": "string",
     "fullName": {
       "firstName": "string updated",
       "lastName": "string updated"
     },
     "age": 10,
     "email": "email@example.com",
     "isActive": true,
     "hobbies": ["string", "string"],
     "address": {
       "street": "string",
       "city": "string",
       "country": "string"
     }
   }
   ```
2. Get All users - GET, /api/users
3. Get a single user - GET, /api/users/:userId
4. Update user information - PUT, /api/users/:userId
   ```json
   payload same as create user, but username and userId should be unique
   ```
5. Delete an user - DELETE, /api/users/:userId
6. create an order - PUT, api/users/:userId/orders
   ```json
   {
     "productName": "productName",
     "price": 300,
     "quantity": 2
   }
   ```
7. Get all orders of the user - GET, /api/users/:userId/orders
8. Calculate totla order price - GET, api/users/:userId/orders/total-price

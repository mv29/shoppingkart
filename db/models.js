const Sequelize =require('sequelize');

const DataTypes= Sequelize.DataTypes;
const  config= require('../../config.json');
const db = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password
    ,{
        dialect:'mysql'
});
const categorie = db.define('categorie',{
   id: {
      type: DataTypes.INTEGER,
       primaryKey: true,
       autoIncrement: true
   },
   name:{
       type:DataTypes.STRING,
       unique:true,
   } ,
    tax:{
       type: DataTypes.FLOAT,
    }
});
const product =db.define('product',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type:DataTypes.STRING,
        alownull:true,
        unique:false
    },
    vendor:{
        type:DataTypes.STRING,
        unique:false,
        alownull:true,
    },
    price:{
        type:DataTypes.INTEGER,
    },
    image:{
        type:DataTypes.STRING,
        unique:false,
        alownull:true,
    }
});
const user = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    admin:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    phone:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    address:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    state:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    pincode:{
        type: DataTypes.INTEGER,
        allowNull: true,
    }
});
const admin = db.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true
    }
});

const cartItem = db.define('cartItem', {
    quantity: DataTypes.SMALLINT,
    state:{
      type:DataTypes.BOOLEAN,
        allowNull: true,
    }
});

cartItem.belongsTo(product);   // cartitem will have a productid to access information form the product tables
//cartItem.belongsTo(user);      // still confusion
user.hasMany(cartItem);        // many cartitem will have the userid to acess user information
cartItem.belongsTo(user);
product.belongsTo(categorie);  // product will have a categoryid to access information form the product tables

// INSERT INTO tablename (col1, col2) VALUES('data1', 'data2' )
// insert into admins (secret,password,createdAt,updatedAt) values('shoppingkart','shopping','2018-04-06 09:46:30','2018-04-06 09:46:30');
db.sync().then(() => "Database created"); // alter:true enables changes in the table and is a object
exports=module.exports={
    db,
    categorie,
    product,
    user,
    cartItem,
    admin,
};

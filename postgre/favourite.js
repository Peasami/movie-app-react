const pgPool = require("./connection");

const sql ={
    GET_FAVOURITE: "SELECT * FROM favourite WHERE account_id = $1",
    DELETE_FAVOURITE: "DELETE FROM favourite WHERE account_id =$1",
    ADD_FAVOURITE: "INSERT INTO favourite (movie_id, account_id) VALUES ($1,$2)"
};

//hakee account_id perusteella käyttäjän lempileffat
//getFavourites(9)
async function getFavourites(account_id){
    try {
        const result = await pgPool.query(sql.GET_FAVOURITE, [account_id]);
        const rows = result.rows;
        return console.log(rows);
        
    } catch (error) {
        console.error("Error executing query:", error);
    }
}


//addFavourite("137",9);
async function addFavourite(movie_id, account_id){

 await pgPool.query(sql.ADD_FAVOURITE, [movie_id, account_id ]);

}
async function deleteFavourite(account_id){

    await pgPool.query(sql.DELETE_FAVOURITE, [account_id ]);
   
   }


module.exports = {getFavourites, addFavourite,deleteFavourite};
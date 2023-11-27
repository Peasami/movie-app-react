const pgPool = require("./connection");

const sql = {
    GET_REVIEWS: "SELECT * FROM review",
    GET_REVIEW: "SELECT * FROM review WHERE account_id = $1",
    POST_REVIEW: "INSERT INTO review (account_id, text, movie_id, rating) VALUES  ($1, $2, $3, $4)",
    DELETE_REVIEW: "DELETE from  review WHERE account_id = $1"
  };
    //Hakee kaikki arvostelut
  //getReviews();
  async function getReviews() {
    try {
        const result = await pgPool.query(sql.GET_REVIEWS);
        const rows = result.rows;
        //console.log(rows);
        return result;
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

//Hakee arvostelut account_id avulla (TESTI)
//getReview(10);

async function getReview(account_id) {
    try {
        const result = await pgPool.query(sql.GET_REVIEW,[account_id]);
        const rows = result.rows;
        return result;
        
    } catch (error) {
        console.error("Error executing query:", error);
    }
}
//asettaa arvot databaseen (TESTI)
//PostReview (9, "huono leffa", 23, 1);    

async function postReview(account_id, text, movie_id, rating) {
    await pgPool.query(sql.POST_REVIEW, [account_id,text,movie_id,rating ]);
    
}
//ajetaan kun käyttäjä poistetaan tietokannasta
async function deleteReview(account_id){
    await pgPool.query(sql.DELETE_REVIEW, [account_id])
}
module.exports={getReviews, getReview, postReview, deleteReview};
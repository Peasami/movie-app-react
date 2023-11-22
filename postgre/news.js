const pgPool = require("./connection");

const sql = {
    ADD_NEWS: "INSERT INTO news (account_id, community_id, news_url) VALUES ($1, $2,$3) ",
    GET_NEWS: "SELECT news_url FROM news WHERE community_id = $1",



}
//getNews(1);
async function getNews(community_id){
    try {
        const result = await pgPool.query(sql.GET_NEWS, [community_id]);
        const rows = result.rows;
        return console.log(rows);
    } catch (error) {
        console.error("Error executing query:", error);
    }
}
//lisää haluttuja uutisia tietokantaan, joita voidaan lisäillä myöhemmin ryhmän sivuille
//addNews(10,1,"Linkki ahdahafufwa") 
async function addNews(account_id, community_id, news_url){
    await pgPool.query(sql.ADD_NEWS, [account_id, community_id, news_url]); 
}

module.exports = {getNews,addNews};
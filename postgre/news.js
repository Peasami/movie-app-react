const pgPool = require("./connection");

const sql = {
    ADD_NEWS: "INSERT INTO news (account_id, community_id, news_url) VALUES ($1, $2,$3) ",
    GET_NEWS_GROUP: "SELECT news_url, news_id FROM news WHERE community_id = $1",
    GET_NEWS_USER: "SELECT news_url FROM news WHERE account_id = $1",
    DELETE_NEWS: "DELETE FROM news WHERE account_id = $1",
    GROUP_DELETE_NEWS: " DELETE FROM news WHERE community_id = $1"


}
//getNews(1);
async function getNews(community_id){
    try {
        const result = await pgPool.query(sql.GET_NEWS_GROUP, [community_id]);
        const rows = result.rows;
        return result;
    } catch (error) {
        console.error("Error executing query:", error);
    }
}

async function getNewsUserPage(account_id){
    try {
        const result = await pgPool.query(sql.GET_NEWS_USER, [account_id]);
        const rows = result.rows;
        return result;
    } catch (error) {
        console.error("Error executing query:", error);
    }
}
//lisää haluttuja uutisia tietokantaan, joita voidaan lisäillä myöhemmin ryhmän sivuille
//addNews(10,1,"Linkki ahdahafufwa") 
async function addNews(account_id, community_id, news_url){
    await pgPool.query(sql.ADD_NEWS, [account_id, community_id, news_url]); 
}

async function deleteNews(account_id){

await pgPool.query(sql.DELETE_NEWS, [account_id]);
} 

async function groupDeleteNews(community_id){
    await pgPool.query(sql.GROUP_DELETE_NEWS, [community_id])
}


module.exports = {getNews,groupDeleteNews,addNews,deleteNews,getNewsUserPage};
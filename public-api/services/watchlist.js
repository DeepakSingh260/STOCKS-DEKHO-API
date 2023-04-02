const BaseService = require('./base-service');
const { WatchlistModel } = require('../models');


class Watchlist extends BaseService {
  constructor(props) {
    super(props);
  }

  async addSymbolToWatchlist() {
    const { stockSymbol,userId } = this.body;
   const existingWatchlist = await WatchlistModel.findOne({userId:userId.toString()});
   let existingWatchlistSymbols = [];
   if (existingWatchlist){
    existingWatchlistSymbols = existingWatchlist.stockSymbols;
   }
   
   existingWatchlistSymbols.push(stockSymbol);
   await WatchlistModel.deleteOne({userId:userId.toString()});
   const data = await WatchlistModel.create({stockSymbols:[ ...new Set(existingWatchlistSymbols) ],userId});
   return {data};
}
  async getWatchlist(){
      const {userId} = this.params;
      const watchlist = await WatchlistModel.findOne({userId});
      return { watchlist: watchlist && watchlist.stockSymbols };
  }

  async checkIfInWatchlist(){
    const { userId } = this.params;
    const { stockSymbol } = this.query
    const watchlist = await WatchlistModel.findOne({ userId })
    const result = watchlist.stockSymbols.filter((symbol)=>symbol==stockSymbol);
    return { isInWatchlist: result.length>0?true:false}
  }

  async deleteWatchlist(stockSymbol){
    const {userId} = this.params;
    const {watchlist} = await this.getWatchlist();
    const result = watchlist.filter((symbol)=>symbol!=stockSymbol);
    console.log(result);
    await WatchlistModel.deleteOne({ userId:userId.toString() });
    const data = await WatchlistModel.create({stockSymbols:[...result],userId});
    return {data};

  }
}

module.exports = Watchlist;

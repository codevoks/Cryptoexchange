import { CreateOrderInput } from "@repo/types/order";
import { PriceLevelMap } from "@repo/types/orderBook"
import { OrderSide } from "@prisma/client";
import { OrderBookLevel,OrderBookSnapshot } from "@repo/types/orderBook"

export class OrderBook {
    private askLevels: PriceLevelMap = new Map;
    private bidLevels: PriceLevelMap = new Map;
    private askPrices: number[] = [];
    private bidPrices: number[] = [];

    public getBidPrices(): number[] {
        return this.bidPrices;
    }

    public getAskPrices(): number[] {
        return this.askPrices;
    }

    public getBidLevels(): PriceLevelMap {
        return this.bidLevels;
    }

    public getAskLevels(): PriceLevelMap {
        return this.askLevels;
    }

    getSideData(order:CreateOrderInput){
        return {
            levels: order.side === OrderSide.BUY? this.bidLevels : this.askLevels,
            prices: order.side === OrderSide.BUY? this.bidPrices : this.askPrices
        }
    }

    addOrder(order:CreateOrderInput): void{
        console.log("ADDING ORDER ",order);
        const price = order.pricePerUnit;
        if(price==undefined){
            return;
        }
        let { levels, prices }  = this.getSideData(order);
        //let level = levels.get(price);
        //level?.push(order);  in case when there is no level for a given price, it won't create one and push the order there)
        if(!levels.has(price)){
            levels.set(price,[]);
            prices.push(order.pricePerUnit!);
            prices.sort((a, b) => order.side === OrderSide.BUY ? b - a : a - b);
        }
        //here this map's value is getting passed by reference so the map will get updated and not the level variable
        let level = levels.get(price);
        level?.push(order);
        this.printOrderBook();
    }

    removeOrder(order: CreateOrderInput): void{
        const price = order.pricePerUnit;
        if(price==undefined){
            return;
        }
        let { levels, prices }  = this.getSideData(order);
        if(levels.has(price)){
            const newLevel = levels.get(price)?.filter(item => item.id !== order.id );
            if(newLevel?.length===0){
                levels.delete(price);
            }
            const priceIndex = prices.findIndex(item => item === price);
            if(priceIndex!== -1){
                prices.splice(priceIndex,1);
            }
        }
    }

    getBestPrice(side: OrderSide): number | undefined{
        let prices = side === OrderSide.BUY ? this.bidPrices : this.askPrices;
        return prices.length > 0 ? prices[0] : undefined;
    }

    getOrdersAtPrice(price: number, side: OrderSide): CreateOrderInput[]{
        const level = side === OrderSide.BUY ? this.bidLevels.get(price) : this.askLevels.get(price);
        return level !== undefined ? level : [];
    }

    reduceOrderQuantity(order: CreateOrderInput, reduction: number): void {
        const price = order.pricePerUnit;
        if(price==undefined){
            return;
        }
        let level = this.getOrdersAtPrice(price, order.side);
        const targetOrder = level.find(o => o.id === order.id);
        if(!targetOrder){
            return;
        }
        targetOrder.quantity-=reduction;
        if(targetOrder.quantity===0){
            this.removeOrder(targetOrder);
        }
    }

    getSlippagePrice( side: OrderSide, bestPrice: number, slippagePercent: number): number {
        return side === OrderSide.BUY ? bestPrice * (1 + slippagePercent)
            : bestPrice * (1 - slippagePercent);
    }
    /*
    A smart way to use ternary operator could be

    getOrdersAtPrice(price: number, side: OrderSide): Order[] {
        return (side === OrderSide.BUY ? this.bidLevels.get(price) : this.askLevels.get(price)) ?? [];
    }
    */
    printOrderBook(): void {
        console.log("======== ORDER BOOK ========");
        
        console.log("\n--- ASK (Sell Orders) ---");
        if (this.askPrices.length === 0) {
            console.log("No asks");
        } else {
            for (const price of this.askPrices) {
                const orders = this.askLevels.get(price)!;
                const totalQty = orders.reduce((sum, o) => sum + o.quantity, 0);
                console.log(`Price: ${price} | Orders: ${orders.length} | Total Qty: ${totalQty}`);
            }
        }

        console.log("\n--- BID (Buy Orders) ---");
        if (this.bidPrices.length === 0) {
            console.log("No bids");
        } else {
            for (const price of this.bidPrices) {
                const orders = this.bidLevels.get(price)!;
                const totalQty = orders.reduce((sum, o) => sum + o.quantity, 0);
                console.log(`Price: ${price} | Orders: ${orders.length} | Total Qty: ${totalQty}`);
            }
        }

        console.log("============================\n");
    }
    private getLevels(levels: PriceLevelMap, prices: number[]): OrderBookLevel[] {
        let cumulativeQty = 0;
        const result: OrderBookLevel[] = [];

        for (const price of prices) {
            const orders = levels.get(price)!;
            const totalQty = orders.reduce((sum, o) => sum + o.quantity, 0);
            cumulativeQty += totalQty;
            result.push({
            price,
            quantity: totalQty,
            cumulativeQuantity: cumulativeQty
            });
        }

        return result;
    }

    public getOrderBookSnapshot(): OrderBookSnapshot {
        return {
            bids: this.getLevels(this.bidLevels, this.bidPrices),
            asks: this.getLevels(this.askLevels, this.askPrices)
        };
    }
}
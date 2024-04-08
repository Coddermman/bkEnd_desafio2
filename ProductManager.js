import fs from 'fs';

class ProductManager{
    #products
    #error
    #patch
    constructor(patch){
        this.#products=[]
        this.#error = undefined
        this.#patch = './productos.json';
    }

    #generateId = ()=> (this.#products.length === 0)? 1 : this.#products[this.#products.length-1].id + 1
    #validation = (title, description, price, thumbnail, code, stock)=>{
       if (!title ||  !description || !price || !thumbnail || !code || !stock) {
        this.#error = `this Item [${title}] missing dates`
       }else {
        const found = this.#products.find(item =>item.code === code)
        if(found) this.#error = `This Item [${title}] with code already used`
        else this.#error = undefined
       }
    
    }
  
getProducts = async ()=> {
    if(fs.existsSync(this.#patch)){
      return this.#products = JSON.parse(await fs.promises.readFile(this.#patch,'utf-8'))    
    }
    return []
}
getProductById = async (id) => {
    this.#products = await this.getProducts();
    const product = await this.#products.find(item => item.id === id)
    if (!product) return `Product with Id ${id} dosen't exist`
    return product
}

addProduct = async (title, description, price, thumbnail, code, stock) =>{
     this.#products = await this.getProducts();
    
    
    this.#validation(title, description, price, thumbnail, code, stock) 
     if (this.#error === undefined ) { 
      this.#products.push({id: this.#generateId(), title, description, price, thumbnail, code, stock})
     await fs.promises.writeFile(this.#patch,JSON.stringify( this.#products,null,'\t'))
     } else console.log(this.#error)
     
}
updateProduct = async (id, atributo, valor) => {
    this.#products = await this.getProducts();
    const indice = this.#products.findIndex(producto => producto.id === id)
    if(indice === -1) {
        return console.log(`The Product with id: ${id} doesn't exits`)
    }
    const productAux = this.#products[indice]
    productAux[atributo] = valor
    this.#products[indice] = productAux

    await fs.promises.writeFile(this.#patch, JSON.stringify(this.#products, null, '\t'))

}
deleteProduct = async (id) =>{
    this.#products = await this.getProducts();
    if( this.#products.some(producto => producto.id === id)) {
        this.#products = this.#products.filter(producto => producto.id !== id)
        if (this.#products.length === 0){
            if (fs.existsSync(this.#patch)){
                await fs.promises.unlink(this.#patch)
            }
        }else {
            await fs.promises.writeFile(this.#patch, JSON.stringify(this.#products, null, ))
        }
    }else {
        console.log(`The Product with id: ${id} doesn't exist`)
    }

}

}
const producto = new ProductManager("./productsFile.txt");

 await producto.addProduct("title1","descriptionA" ,"price1","imagen1",1221,"stock1")

 await producto.addProduct("title2","descriptionB" ,"price2","imagen2",8599,"stock2")

 await producto.addProduct("title3","descriptionC" ,"price3","imagen3",7215,"stock3")

 await producto.addProduct("title4","descriptionD" ,"price4","imagen4",2112,"stock4") 

 await producto.addProduct("title5","descriptionE" ,"price5", "imagen5", 4249,"stock5") 
 console.log( await producto.getProducts());
 console.log( await producto.getProductById(2));
 console.log(await producto.getProductById(10));

 await producto.deleteProduct(2);

 await producto.updateProduct(3,"price","newprice3")

console.log(await producto.getProducts());


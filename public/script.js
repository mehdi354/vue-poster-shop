var Load_NUM = 4;
var watcher;
new Vue({
	el : "#app",
	data : {
		total : 0,
		products : [
			// {title:'Product 1',id:1,price:9.10000},
			// {title:'Product 2',id:2,price:14.54450},
			// {title:'Product 3',id:3,price:15},
		],
		carts:[],
		search: 'cat',
		lastSearch:'',
		isLoading : false,
		result:[]
	},
	methods: {
		addToCart: function(product){
			this.total += product.price;
			var found = false;
			for(var i =0 ; i< this.carts.length ;i++){
				if(this.carts[i].id === product.id){
					this.carts[i].qty++;
					found = true
				}
			}
			if(!found){
				this.carts.push({
				id : product.id,
				title : product.title,
				price : product.price,
				qty : 1,
			});
			}
			console.log(this.carts);
		},
		inc : function(item){
			item.qty++;
			this.total += item.price;
		},
		dec : function(item){
			item.qty--;
			this.total -= item.price;
			if(item.qty<=0 ) {
				var i = this.carts.indexOf(item);
				this.carts.splice(i,1)
			}
			
		},
		onSubmit(){
			this.products = [];
			this.result = [];
			this.isLoading = true;
			var path = "/search?q=".concat(this.search);
			this.$http.get(path).then(function(response){
				setTimeout(function(){ 
					this.result = response.body;
				//	this.products = response.body.slice(0,Load_NUM);
					this.appendResults();
					this.lastSearch = this.search ;
					this.isLoading = false;
				}.bind(this), 3000);
			
			});
		},
		appendResults : function(){
			if(this.products.length < this.result.length) {
				var toAppend = this.result.slice(this.products.length,Load_NUM+this.products.length);
				this.products = this.products.concat(toAppend);
			}
		}
	},
	filters :{
		currency : function(price) {
			return "$" .concat(price.toFixed(2))
		}
	},
	created :function() {
		this.onSubmit();
	},
	updated: function(){
		var sensor = document.querySelector(".project-list-bottom");
		watcher = scrollMonitor.create(sensor);
		watcher.enterViewport(this.appendResults);
	},
	beforeUpdate:function(){
		if(watcher) {
			watcher.destroy();
			watcher = null;
		}
	}
});


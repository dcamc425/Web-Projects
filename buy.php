<?php
#####SESSION VARIABLES####
session_start();
if(empty($_SESSION['cart'])){
	$_SESSION['cart'] = array();
}
if(empty($_SESSION['result'])){
$_SESSION['result'] = array();
}
####XML VARIABLES####	
$url = 'http://sandbox.api.ebaycommercenetwork.com/publisher/3.0/rest/GeneralSearch?apiKey=78b0db8a-0ee1-4939-a2f9-d3cd95ec0fcc&trackingId=7000610&keyword=';
$input = urlencode($_GET['search']);
$xmlstr = file_get_contents($url.$input);
$xml = new SimpleXMLElement($xmlstr);
####REQUESTS####
if($_GET['clear'] == 1){
	unset($_SESSION['cart']);
	unset($_SESSION['result']);
}
if(isset($_GET['delete'])){
	$delete_id = (string) $_GET['delete'];
	if(isset($_SESSION['cart'])){
		foreach($_SESSION['cart'] as $cart_array => $value){
			if($value == $delete_id){
				unset($_SESSION['cart'][$cart_array]);
			}
		}
	}
}
##########################
?>
<html>
<head><title>Buy Products</title></head>
<body>
<!--Item Search-->
<form action="buy.php" method="GET">
<fieldset style="width:300px;height:40px;"><legend>Find Products:</legend>
<label>Item Search: <input type="text" name="search"/></label>
<input type="submit" value="Search"/>
</fieldset>
</form>
Shopping Cart:
<?php
if(isset($_GET['buy'])){
	$product_id = (string) $_GET['buy'];
	if(isset($_SESSION['cart'])){
		if(!in_array($product_id,$_SESSION['cart'])){
			array_push($_SESSION['cart'],$product_id);
		}
	}
}
echo "<table border=1>";
echo "<th>Product Image</th>";
echo "<th>Product Name</th>";
echo "<th>Price</th>";
echo "<th></th>";

	
foreach($_SESSION['result'] as $item){
	foreach($_SESSION['cart'] as $cart_item){
		if($cart_item == $item[0]){
			$item_image = $item[1];
			$item_name = $item[2];
			$item_price = $item[3];
			$item_offer = $item[4];	
			echo "<tr>";
			echo "<td><a href='".$item_offer."'><img src=".$item_image."></img></a></td>";
			echo "<td>".$item_name."</td>";
			echo "<td>".'$'.$item_price."</td>";
			echo "<td><a href='buy.php?delete=".$item[0]."'>Delete</a></td>";
			$total = $total + $item_price;
		}
	}
}
echo "</table>";
echo "<div>Total: ".'$'.$total."</div>";
echo '<form action="buy.php" method="GET">';
echo '<input type="hidden" name="clear" value="1"/>';
echo '<input type="submit" value="Empty Basket"/>';
echo '</form>';
?>
<?php
if(isset($_GET['search'])){
	echo "<table border=1>";
	echo "<th>Product Image</th>";
	echo "<th>Product Name</th>";
	echo "<th>Price</th>";
	foreach($xml->categories->category->items->product as $product){
		$imageURL = (string) $product->images->image[0]->sourceURL;
		$id = (string) $product['id'];
		$name = (string) $product->name;
		$price = (string) $product->minPrice;
		$offers = (string) $product->productOffersURL;
		echo "<tr>";
		echo "<td><a href='buy.php?buy=".$id."'><img src=".$imageURL."></img></a></td>";
		echo "<td>".$product->name."</td>";
		echo "<td>".'$'.$product->minPrice."</td>";
		$array_contents = array($id,$imageURL,$name,$price,$offers);
		array_push($_SESSION['result'], $array_contents);
	}
}
?>
</body>
</html>

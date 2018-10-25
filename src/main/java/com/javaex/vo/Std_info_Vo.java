package com.javaex.vo;

public class Std_info_Vo {
	
	private String recipe_code;
	private String recipe_name;
	private String intro;
	private String food_type_code;
	private String food_type;
	private String food_class_code;
	private String food_class;
	private String cooking_time;
	private String kalo;
	private String quantity;
	private String difficult;
	private String ingre_class;
	private String price_class;
	private String img_url;
	private String detail_url;
	
	public Std_info_Vo() {
	}

	public Std_info_Vo(
			String recipe_code,
			String recipe_name,
			String intro,
			String food_type_code,
			String food_type,
			String food_class_code,
			String food_class,
			String cooking_time,
			String kalo,
			String quantity,
			String difficult,
			String ingre_class,
			String price_class,
			String img_url,
			String detail_url) {
		this.recipe_code = recipe_code;
		this.recipe_name = recipe_name;
		this.intro = intro;
		this.food_type = food_type;
		this.food_type_code = food_type_code;
		this.food_class = food_class;
		this.food_class_code = food_class_code;
		this.cooking_time = cooking_time;
		this.kalo = kalo;
		this.quantity = quantity;
		this.difficult = difficult;
		this.ingre_class = ingre_class;
		this.price_class = price_class;
		this.img_url = img_url;
		this.detail_url = detail_url;
	}
	
	

	public String getRecipe_code() {
		return recipe_code;
	}



	public void setRecipe_code(String recipe_code) {
		this.recipe_code = recipe_code;
	}



	public String getRecipe_name() {
		return recipe_name;
	}



	public void setRecipe_name(String recipe_name) {
		this.recipe_name = recipe_name;
	}



	public String getIntro() {
		return intro;
	}



	public void setIntro(String intro) {
		this.intro = intro;
	}



	public String getFood_type_code() {
		return food_type_code;
	}



	public void setFood_type_code(String food_type_code) {
		this.food_type_code = food_type_code;
	}



	public String getFood_type() {
		return food_type;
	}



	public void setFood_type(String food_type) {
		this.food_type = food_type;
	}



	public String getFood_class_code() {
		return food_class_code;
	}



	public void setFood_class_code(String food_class_code) {
		this.food_class_code = food_class_code;
	}



	public String getFood_class() {
		return food_class;
	}



	public void setFood_class(String food_class) {
		this.food_class = food_class;
	}



	public String getCooking_time() {
		return cooking_time;
	}



	public void setCooking_time(String cooking_time) {
		this.cooking_time = cooking_time;
	}



	public String getKalo() {
		return kalo;
	}



	public void setKalo(String kalo) {
		this.kalo = kalo;
	}



	public String getQuantity() {
		return quantity;
	}



	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}



	public String getDifficult() {
		return difficult;
	}



	public void setDifficult(String difficult) {
		this.difficult = difficult;
	}



	public String getIngre_class() {
		return ingre_class;
	}



	public void setIngre_class(String ingre_class) {
		this.ingre_class = ingre_class;
	}



	public String getPrice_class() {
		return price_class;
	}



	public void setPrice_class(String price_class) {
		this.price_class = price_class;
	}



	public String getImg_url() {
		return img_url;
	}



	public void setImg_url(String img_url) {
		this.img_url = img_url;
	}



	public String getDetail_url() {
		return detail_url;
	}



	public void setDetail_url(String detail_url) {
		this.detail_url = detail_url;
	}



	@Override
	public String toString() {
		return "std_info[recipe_code=" + recipe_code +
				", recipe_name=" + recipe_name + 
				", intro=" + intro + 
				", food_type_code=" + food_type_code + 
				", food_type=" + food_type +
				", food_class_code" + food_class_code +
				", food_class" + food_class +
				", cooking_time" + cooking_time +
				", kalo" + kalo +
				", quantity" + quantity+
				", difficult" + difficult +
				", ingre_class" + ingre_class +
				", price+class" + price_class +
				", detail_url" + detail_url
				+"]";
	}
	
	
}

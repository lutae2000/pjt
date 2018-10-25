package com.javaex.vo;

public class HowtocookVo {
	private String recipe_code;
	private String how_to_cook_order;
	private String how_to_cook;
	private String how_to_cook_img;
	private String tip;
	
	
	public HowtocookVo() {
		// TODO Auto-generated constructor stub
	}
	
	public HowtocookVo(String recipe_code, String how_to_cook_order,String how_to_cook,String how_to_cook_img,String tip) {
		this.recipe_code = recipe_code;
		this.how_to_cook_order = how_to_cook_order;
		this.how_to_cook = how_to_cook;
		this.how_to_cook_img = how_to_cook_img;
		this.tip = tip;
	}
	
	public String getRecipe_code() {
		return recipe_code;
	}
	public void setRecipe_code(String recipe_code) {
		this.recipe_code = recipe_code;
	}
	public String getHow_to_cook_order() {
		return how_to_cook_order;
	}
	public void setHow_to_cook_order(String how_to_cook_order) {
		this.how_to_cook_order = how_to_cook_order;
	}
	public String getHow_to_cook() {
		return how_to_cook;
	}
	public void setHow_to_cook(String how_to_cook) {
		this.how_to_cook = how_to_cook;
	}
	public String getHow_to_cook_img() {
		return how_to_cook_img;
	}
	public void setHow_to_cook_img(String how_to_cook_img) {
		this.how_to_cook_img = how_to_cook_img;
	}
	public String getTip() {
		return tip;
	}
	public void setTip(String tip) {
		this.tip = tip;
	}

	@Override
	public String toString() {
		return "HowtocookVo [recipe_code=" + recipe_code + ", how_to_cook_order=" + how_to_cook_order + ", how_to_cook="
				+ how_to_cook + ", how_to_cook_img=" + how_to_cook_img + ", tip=" + tip + "]";
	}
	
	
	

}

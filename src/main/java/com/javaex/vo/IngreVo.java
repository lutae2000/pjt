package com.javaex.vo;

public class IngreVo {
	private String recipe_code;
	private String ingre_turn;
	private String ingre_name;
	private String ingre_quantity;
	private String ingre_type_code;
	private String ingre_type_name;
	
	public IngreVo() {
		// TODO Auto-generated constructor stub
	}
	
	public IngreVo(String recipe_code,String ingre_turn,String ingre_name,String ingre_quantity,String ingre_type_code,String ingre_type_name) {
		this.recipe_code = recipe_code;
		this.ingre_turn = ingre_turn;
		this.ingre_name = ingre_name;
		this.ingre_quantity = ingre_quantity;
		this.ingre_type_code = ingre_type_code;
		this.ingre_type_name = ingre_type_name;
	}
	
	public String getRecipe_code() {
		return recipe_code;
	}
	public void setRecipe_code(String recipe_code) {
		this.recipe_code = recipe_code;
	}
	public String getIngre_turn() {
		return ingre_turn;
	}
	public void setIngre_turn(String ingre_turn) {
		this.ingre_turn = ingre_turn;
	}
	public String getIngre_name() {
		return ingre_name;
	}
	public void setIngre_name(String ingre_name) {
		this.ingre_name = ingre_name;
	}
	public String getIngre_quantity() {
		return ingre_quantity;
	}
	public void setIngre_quantity(String ingre_quantity) {
		this.ingre_quantity = ingre_quantity;
	}
	public String getIngre_type_code() {
		return ingre_type_code;
	}
	public void setIngre_type_code(String ingre_type_code) {
		this.ingre_type_code = ingre_type_code;
	}
	public String getIngre_type_name() {
		return ingre_type_name;
	}
	public void setIngre_type_name(String ingre_type_name) {
		this.ingre_type_name = ingre_type_name;
	}

	@Override
	public String toString() {
		return "IngreVo [recipe_code=" + recipe_code + ", ingre_turn=" + ingre_turn + ", ingre_name=" + ingre_name
				+ ", ingre_quantity=" + ingre_quantity + ", ingre_type_code=" + ingre_type_code + ", ingre_type_name="
				+ ingre_type_name + "]";
	}
	
	
}

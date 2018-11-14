package com.javaex.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.javaex.service.UserService;

@Controller
public class UserController {

	@Autowired
	UserService userService;
	
	@RequestMapping("/index")
	public String showIndex(){
		return "index";
	}
	
	@RequestMapping("/main")
	public String mainPage() {
		return "main";
	}
	
	@RequestMapping(value="/readContent", method=RequestMethod.GET)
	public String readContent(@RequestParam("recipe_code") String recipe_code, Model model) {
//		System.out.println(recipe_code);
		
		Map<String, Object> recipe = userService.getContent(recipe_code);
		System.out.println("===============");
		System.out.println(recipe);
		
		model.addAttribute("recipe", recipe);
		return "readContent";
	}
	
	@RequestMapping("/selectIngre")
	public String selectIngre() {
		return "selectIngre";
		
	}
	
	@RequestMapping("/recipeResult")
	public String selectedResult(@RequestParam("ingreInfo") List<String> selectedIngresList, Model model) {
		Map<String, Object> selectedIngreResultMap = userService.getSelectedIngreResult(selectedIngresList);
		model.addAttribute("selectedIngreResultMap",selectedIngreResultMap);
		return "ingreResult";
	}
	
	@RequestMapping("/recipeSearchedResult")
	public String recipeSearchedResult() {
		return "";
	}

	
	
/*	@RequestMapping(value="/list", method=RequestMethod.GET)
	public String list(Model model) {
		List<Std_info_Vo> allListMap = userService.getAllList();
//		Map<String, Object> count = userService.
		model.addAttribute("allList",allListMap);
		System.out.println(allListMap.toString());
		return "list"; 
	}*/
	
	@RequestMapping(value="/list/search", method=RequestMethod.GET)
	public String searchedList(@RequestParam(value="kwd", defaultValue="")String kwd, Model model) {
//		System.out.println(kwd);
		
		Map<String, Object> searchedList = userService.getSearchMap(kwd);
	/*	Map<String, Object> count = userService.getSearchMap(kwd);
		
		System.out.println(count.toString());*/
		
		model.addAttribute("searchedList",searchedList);
//		model.addAttribute("count",count);
		return "list";
	}
	
	@RequestMapping(value="/recommend", method=RequestMethod.GET)
	public String recommendPage(@RequestParam(defaultValue="", required=false) String recommend,Model model) {
		Map<String, Object> recommendMap = userService.getRecommend(recommend);
		
		model.addAttribute("recommendRecipe",recommendMap);
		return "recommend";
	}
	
	@RequestMapping("/test")
	public String testpage() {
		return "test";
	}
	
	
	
/*	@RequestMapping(value="/recipeResult", method=RequestMethod.POST)
	public String recommend(@ModelAttribute IngreSelect ingreSelect, Model model) {
		return "recommend";
	}*/


}
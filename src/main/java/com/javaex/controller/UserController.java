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
import com.javaex.vo.Std_info_Vo;

@Controller
public class UserController {

	@Autowired
	UserService userService;
	
	@RequestMapping("/allList")
	public String getUserList(Model model){
		List<Std_info_Vo> allList = userService.getAllList();
		
		System.out.println(allList.toString());
		
		model.addAttribute("allList", allList);
		return "allList";
	}
	
	@RequestMapping(value="/readContent", method=RequestMethod.GET)
	public String readContent(@RequestParam("recipe_code") String recipe_code, Model model) {
		System.out.println(recipe_code);
		
		Map<String, Object> recipe = userService.getContent(recipe_code);
		System.out.println(recipe);
		
		model.addAttribute("recipe", recipe);
		
		
		
		return "readContent";
	}

	
	
	@RequestMapping(value="/list", method=RequestMethod.GET)
	public String list(Model model) {
		List<Std_info_Vo> list = userService.getAllList();
		model.addAttribute("list",list);
		System.out.println(list.toString());
		return "list";
	}
	
	@RequestMapping(value="/list/search", method=RequestMethod.GET)
	public String searchedList(@RequestParam("kwd") String kwd, Model model) {
		System.out.println(kwd);
//		List<Std_info_Vo> searchedList = userService.getSearchList(kwd);
		Map<String, Object> count = userService.getSearchList(kwd);
		System.out.println(count.toString());
		model.addAttribute("list",count);
		return "list";
	}
	
	@RequestMapping("/recommandPage")
	public String recommandPage() {
		return "recommand";
	}
	
	@RequestMapping(value="/recommand", method=RequestMethod.GET)
	public String recommand(@RequestParam("foodType") String foodType, Model model) {
		System.out.println(foodType);
		List<Std_info_Vo> recommandList = userService.getRecommand(foodType);
		System.out.println(recommandList.toString());
		model.addAttribute("recommandRecipe", recommandList);
		return "recommand";
	}


}
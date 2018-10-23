package com.javaex.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.javaex.service.UserService;
import com.javaex.vo.std_info_vo;

@Controller
public class UserController {

	@Autowired
	UserService userService;
	
	@RequestMapping("/allList")
	public String getUserList(Model model){
		List<std_info_vo> allList = userService.getAllList();
		
		System.out.println(allList.toString());
		
		model.addAttribute("allList", allList);
		return "allList";
	}
	
//	@RequestMapping(value="readContent", method=RequestMethod.GET)
//	public String readContent(@RequestParam("reci_name") String reci_name,Model model) {
//		std_info_vo std_info_vo = userService.getContent(reci_name);
//		model.addAttribute("readRecipe", std_info_vo);
//		return "list/readContent";
//	}

	
	
	@RequestMapping(value="/list", method=RequestMethod.GET)
	public String list(Model model) {
		List<std_info_vo> list = userService.getAllList();
		model.addAttribute("list",list);
		System.out.println(list.toString());
		return "list";
	}
	
	@RequestMapping(value="/list/search", method=RequestMethod.GET)
	public String searchedList(@RequestParam("kwd") String kwd, Model model) {
		System.out.println(kwd);
		List<std_info_vo> searchedList = userService.getSearchList(kwd);
		System.out.println(searchedList.toString());
		model.addAttribute("list",searchedList);
		return "list";
	}


}
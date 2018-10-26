package com.javaex.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javaex.dao.UserDao;
import com.javaex.vo.HowtocookVo;
import com.javaex.vo.IngreVo;
import com.javaex.vo.Std_info_Vo;

@Service
public class UserService {
	
	@Autowired
	UserDao userDao;
	
	public List<Std_info_Vo> getAllList(){
		Map<String, Object> allListMap = new HashMap<String, Object>();
		List<Std_info_Vo> allList = userDao.getAllList();
		String totalCount = userDao.totalCount("");
		String searchedCount = userDao.searchedCount("");
		
		allListMap.put("allList", allList);
		allListMap.put("totalCount", totalCount);
		allListMap.put("searchCount", searchedCount);
		return allList;
	}
	
	
	public Map<String, Object> getSearchMap(String searchKwd){
		Map<String, Object> searchedResult = new HashMap<String, Object>();
		List<Std_info_Vo> std_info_List = userDao.searchedList(searchKwd);
		String searchedCount = userDao.searchedCount(searchKwd);
		String totalCount = userDao.totalCount(searchKwd);
//		List<Std_info_Vo> allList = userDao.getAllList();
		
		searchedResult.put("searchedCount", searchedCount);
		searchedResult.put("totalCount", totalCount);
		searchedResult.put("std_info_List", std_info_List);
//		searchedResult.put("allList", allList);
		return searchedResult;
	}
	
	
	public Map<String, Object> getContent(String recipe_code){
		
		Map<String, Object> recipe = new HashMap<String, Object>();
		
		Std_info_Vo std_info_Vo  = userDao.readContent_std(recipe_code);
		List<IngreVo> ingreList =  userDao.readIngre_info(recipe_code);
		List<HowtocookVo> howtocookList = userDao.readContent_howToCook(recipe_code);
		
		recipe.put("std_info_Vo", std_info_Vo);
		recipe.put("ingreList", ingreList);
		recipe.put("howtocookList", howtocookList);
		
		return recipe;
	}
	
	public List<Std_info_Vo> getRecommand(String recipe){
		List<Std_info_Vo> recommandList = userDao.recommandDao(recipe);
//		System.out.println(recommandList.toString());
		return recommandList;
	}

}

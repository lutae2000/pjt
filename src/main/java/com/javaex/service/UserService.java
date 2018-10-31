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
		int addHit = userDao.updateHit(recipe_code);
		
		recipe.put("addHit", addHit);
		recipe.put("std_info_Vo", std_info_Vo);
		recipe.put("ingreList", ingreList);
		recipe.put("howtocookList", howtocookList);
		
		return recipe;
	}
	
	public Map<String, Object> getRecommend(String recipe){
		Map<String, Object> recommend = new HashMap<String, Object>();
		
		List<Std_info_Vo> recommendKorList = userDao.recommendDao("한식");
		List<Std_info_Vo> recommendJpnList = userDao.recommendDao("일본");
		List<Std_info_Vo> recommendChnList = userDao.recommendDao("중국");
		List<Std_info_Vo> recommendFusList = userDao.recommendDao("퓨전");
		List<Std_info_Vo> recommendEastList = userDao.recommendDao("동남아시아");
		List<Std_info_Vo> recommendWestList = userDao.recommendDao("서양");
		List<Std_info_Vo> recommendItalList = userDao.recommendDao("이탈리아");
		
		List<Std_info_Vo> korRankingList = userDao.selectHit("한식");
		List<Std_info_Vo> jpnRankingList = userDao.selectHit("일본");
		List<Std_info_Vo> chnRankingList = userDao.selectHit("중국");
		List<Std_info_Vo> fusRankingList = userDao.selectHit("퓨전");
		List<Std_info_Vo> eastRankingList = userDao.selectHit("동남아시아");
		List<Std_info_Vo> westRankingList = userDao.selectHit("서양");
		List<Std_info_Vo> italRankingList = userDao.selectHit("이탈리아");
		
		/*String[] foodTypeList = {"한식","중국","일본","퓨전","동남아시아","이탈리아"};
		for(String s : foodTypeList) {
			List<Std_info_Vo>foodTypeList2 = userDao.selectHit(s);
			recommend.put(arg0, arg1)
		}*/

		int addHit = userDao.updateHit(recipe);
		
		
		recommend.put("korRankingList", korRankingList);
		recommend.put("jpnRankingList", jpnRankingList);
		recommend.put("chnRankingList", chnRankingList);
		recommend.put("fusRankingList", fusRankingList);
		recommend.put("eastRankingList", eastRankingList);
		recommend.put("westRankingList", westRankingList);
		recommend.put("italRankingList", italRankingList);
		
		recommend.put("recommendKorList", recommendKorList);
		recommend.put("recommendJpnList", recommendJpnList);
		recommend.put("recommendChnList", recommendChnList);
		recommend.put("recommendFusList", recommendFusList);
		recommend.put("recommendEastList", recommendEastList);
		recommend.put("recommendWestList", recommendWestList);
		recommend.put("recommendItalList", recommendItalList);
		
		/*System.out.println(chnRankingList);*/

		recommend.put("addHit", addHit);


//		System.out.println(recommandList.toString());
		return recommend;
	}
	
/*	public Map<String, Object> getSelect(String ingre){
		Map<String, Object> select_ingre = new HashMap<String, Object>();
		
		List<IngreVo> ingre_list = userDao.selectIngre(ingre);
		List<Std_info_Vo> std_info_Vo = userDao.getAllList();
		List<Std_info_Vo> hitList=userDao.selectHit();
		
//		String totalCount = userDao.totalCount(ingre);
//		String searchedCount = userDao.searchedCount(ingre);
		
		select_ingre.put("hitList", hitList);
		select_ingre.put("ingre_list", ingre_list);
		select_ingre.put("std_info", std_info_Vo);
		
		
//		select_ingre.put("totalCount", totalCount);
//		select_ingre.put("searchedCount", searchedCount);
		return select_ingre;
		
	}*/

}

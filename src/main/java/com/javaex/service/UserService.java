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
	
/*	public List<Std_info_Vo> getAllList(){
		Map<String, Object> allListMap = new HashMap<String, Object>();
		List<Std_info_Vo> allList = userDao.getAllList();
		int totalCount = userDao.totalCount("");
		int searchedCount = userDao.searchedCount("");
		
		allListMap.put("allList", allList);
		allListMap.put("totalCount", totalCount);
		allListMap.put("searchCount", searchedCount);
		return allList;
	}*/
	
	
	public Map<String, Object> getSearchMap(String searchKwd){
		Map<String, Object> searchedResult = new HashMap<String, Object>();
		List<Std_info_Vo> std_info_List = userDao.searchedList(searchKwd);
		int totalCount = userDao.totalCount(searchKwd);
		int searchedCount = userDao.searchedCount(searchKwd);
		
		/*int searchedCount = userDao.searchedCount(searchKwd);*/
		
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
/*		List<IngreVo> mainIngreList =  userDao.readIngre_info("주재료");
		List<IngreVo> subIngreList = userDao.readIngre_info("부재료");
		List<IngreVo> sauceIngreList = userDao.readIngre_info("양념");*/
		
		List<IngreVo> mainIngreList = userDao.readMainIngre_info(recipe_code);
		List<IngreVo> subIngreList = userDao.readSubIngre_info(recipe_code);
		List<IngreVo> sauceIngreList = userDao.readSauceIngre_info(recipe_code);
		
		List<HowtocookVo> howtocookList = userDao.readContent_howToCook(recipe_code);
		List<Std_info_Vo> contentRecommend = userDao.readContentRecommend(std_info_Vo.getFood_class());
		System.out.println(mainIngreList);
		int addHit = userDao.updateHit(recipe_code);
		
		recipe.put("contentRecommend", contentRecommend);
		recipe.put("addHit", addHit);
		recipe.put("std_info_Vo", std_info_Vo);
		recipe.put("mainIngreList", mainIngreList);
		recipe.put("subIngreList", subIngreList);
		recipe.put("sauceIngreList", sauceIngreList);
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




//		System.out.println(recommandList.toString());
		return recommend;
	}

	public Map<String,Object> getSelectedIngreResult(List<String> selectedIngresList){
		Map<String, Object> ingreMap = new HashMap<String, Object>();
		List<Std_info_Vo> ingreList = userDao.selectIngre(selectedIngresList);
		int totalCount = userDao.totalCount("");
		int searchedCount = userDao.ingreResultSearchedCount(selectedIngresList);
		ingreMap.put("std_info_List", ingreList);
		ingreMap.put("totalCount", totalCount);
		ingreMap.put("searchCount", searchedCount);
			
		return ingreMap;
	}

}

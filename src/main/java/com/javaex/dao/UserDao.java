package com.javaex.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.javaex.vo.HowtocookVo;
import com.javaex.vo.IngreVo;
import com.javaex.vo.Std_info_Vo;


@Repository
public class UserDao {

	@Autowired
	SqlSession sqlsession;
	
	public List<Std_info_Vo> getAllList(){
		List<Std_info_Vo> allList = sqlsession.selectList("user.allList");	
		return allList;
	}

	
	public List<Std_info_Vo> searchedList(String searchKwd){
//		System.out.println(searchKwd.toString());
//		System.out.println(searchedList.toString());
		return sqlsession.selectList("user.searchedList", searchKwd);
	}
	
	//기본레시피정보 가져오기
	public Std_info_Vo readContent_std(String recipe_code) {
		Std_info_Vo readStdContent = sqlsession.selectOne("user.readContent_std", recipe_code);
		return readStdContent;
	}
	
/*	//재료리스트 가져오기
	public List<IngreVo> readIngre_info(String recipe_code){
		List<IngreVo> readIngreInfoContentList = sqlsession.selectList("user.readContent_ingre", recipe_code);
		return readIngreInfoContentList;
	}*/
	public List<IngreVo> readMainIngre_info(String recipe_code){
		List<IngreVo> readMainIngreInfoContentList = sqlsession.selectList("user.readContentMain_ingre", recipe_code);
		return readMainIngreInfoContentList;
	}
	
	//readContent 부재료부분 출력
	public List<IngreVo> readSubIngre_info(String recipe_code){
		List<IngreVo> readSubIngreInfoContentList = sqlsession.selectList("user.readContentSub_ingre", recipe_code);
		return readSubIngreInfoContentList;
	}
	
	//readContent 양념부분 출력
	public List<IngreVo> readSauceIngre_info(String recipe_code){
		List<IngreVo> readSauceIngreInfoContentList = sqlsession.selectList("user.readContentSauce_ingre", recipe_code);
		return readSauceIngreInfoContentList;
	}
	
	
	//요리순서 리스트
	public List<HowtocookVo> readContent_howToCook(String recipe_code){
		List<HowtocookVo> readHTCContentList  = sqlsession.selectList("user.readContent_howToCook", recipe_code);
		return readHTCContentList;
	}
	
	//메뉴 검색된 갯수
	public int searchedCount(String kwd) {
		System.out.println(kwd);
		return sqlsession.selectOne("user.searchedCount",kwd);
	}
	
	//메뉴 총 갯수
	public int totalCount(String totalCount) {
		System.out.println(totalCount.toString());
		return sqlsession.selectOne("user.allListCount", totalCount);
	}
	
	//랜덤 추천
	public  List<Std_info_Vo> recommendDao(String recommend) {
		List<Std_info_Vo> recommendList = sqlsession.selectList("recommendation.recommendFoodType", recommend);
//		System.out.println(recommendList.toString());

		return recommendList;
	}
	
	
	//재료 선택 리스트
		public List<Std_info_Vo> selectIngre(List<String> selectedIngresList){
			System.out.println("dao:"+selectedIngresList);
			System.out.println("dao:"+selectedIngresList.size());
			List<Std_info_Vo>  selectIngre = sqlsession.selectList("selectIngre.selectIngre", selectedIngresList);
//			int selectedIngreListCount = (selectIngre.size());
//			selectIngre.put("selectedIngreListCount", selectedIngreListCount);
			
			System.out.println("===================");
			System.out.println(selectIngre);
			return selectIngre;
		}
	
	/*//재료 선택 리스트
	public Map<String,Object> selectIngre(List<String> selectedIngresList){
		System.out.println("dao:"+selectedIngresList);
		System.out.println("dao:"+selectedIngresList.size());
		Map<String,Object>  selectIngre = sqlsession.selectMap("selectIngre.selectIngre", selectedIngresList, "selectedIngreMap");
		int selectedIngreListCount = (selectIngre.size());
		selectIngre.put("selectedIngreListCount", selectedIngreListCount);
		
		System.out.println("===================");
		System.out.println(selectIngre);
		return selectIngre;
	}*/
	
	//레시피 선택시 히트+1
	public int updateHit(String recipe_code) {
		return sqlsession.update("recommendation.updateHit", recipe_code);
	}
	
	//히트 높은 순서대로 3개 가져옴
	public List<Std_info_Vo> selectHit(String selectHit){
		return sqlsession.selectList("recommendation.selectHit",selectHit);
	}
	
	//readContent에서 관련 레시피 추천부분
	public List<Std_info_Vo> readContentRecommend(String recommendFoodClass){
//		System.out.println("StartDao"+recommendFoodClass);
		List<Std_info_Vo> recommendList = sqlsession.selectList("recommendation.associateMenu",recommendFoodClass);
//		System.out.println("dao"+recommendList.toString());
		return recommendList;
	}
	
	//재료선택해서 나온 결과 레시피 카운트
	public int ingreResultSearchedCount (List<String> ingreList){
		int ingreListResult = sqlsession.selectOne("selectIngre.ingreResultSearchedCount",ingreList);
		System.out.println(ingreListResult);
		return ingreListResult;
	}
	
	
	
	

}

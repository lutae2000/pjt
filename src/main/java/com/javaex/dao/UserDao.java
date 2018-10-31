package com.javaex.dao;

import java.util.List;

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
	
	//요리순서 리스트
	public List<IngreVo> readIngre_info(String recipe_code){
		List<IngreVo> readIngreInfoContentList = sqlsession.selectList("user.readContent_ingre", recipe_code);
		return readIngreInfoContentList;
	}
	
	//재료리스트 가져오기
	public List<HowtocookVo> readContent_howToCook(String recipe_code){
		List<HowtocookVo> readHTCContentList  = sqlsession.selectList("user.readContent_howToCook", recipe_code);
		return readHTCContentList;
	}
	
	//메뉴 검색된 갯수
	public String searchedCount(String searchedcount) {
		System.out.println(searchedcount);
		return sqlsession.selectOne("user.searchedCount",searchedcount);
	}
	
	//메뉴 총 갯수
	public String totalCount(String totalCount) {
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
	public List<IngreVo> selectIngre(String recipe_name){
		List<IngreVo>  selectIngre = sqlsession.selectList("selectIngre.selectIngre", recipe_name);
		System.out.println(selectIngre.toString());
		return selectIngre;
	}
	
	//레시피 선택시 히트+1
	public int updateHit(String recipe_code) {
		return sqlsession.update("recommendation.updateHit", recipe_code);
	}
	
	//히트 높은 순서대로 3개 가져옴
	public List<Std_info_Vo> selectHit(String selectHit){
		return sqlsession.selectList("recommendation.selectHit",selectHit);
	}
	
	

}

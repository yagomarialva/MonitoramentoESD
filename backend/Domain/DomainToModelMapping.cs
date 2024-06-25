using AutoMapper;
using BiometricFaceApi.Models;
using Mysqlx.Crud;

namespace BiometricFaceApi.Domain
{
    public class DomainToModelMapping : Profile
    {
        public DomainToModelMapping() 
        {
            CreateMap<BraceletModel, BraceletAttributeModel>();
            CreateMap<StationModel, StationAttributeModel>();
        }
    }
}

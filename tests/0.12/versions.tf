provider "aws" {
  version = "~> 2"
  region  = "us-east-1"
}

terraform {
  required_version = "~> 0.12"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.27"
    }
  }
}

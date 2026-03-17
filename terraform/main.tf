terraform {
  required_providers {
    null = {
      source = "hashicorp/null"
      version = "~> 3.2.0"
    }
  }
}

provider "null" {}

resource "null_resource" "docker_compose" {
  # Trigger on every apply - or keep it static if we want to preserve state
  triggers = {
    # always_run = timestamp() # Uncomment if we want re-run every time
  }

  provisioner "local-exec" {
    command = "docker-compose up -d --build"
    working_dir = "${path.module}/.."
  }

  provisioner "local-exec" {
    when    = destroy
    command = "docker-compose down"
    working_dir = "${path.module}/.."
  }
}
